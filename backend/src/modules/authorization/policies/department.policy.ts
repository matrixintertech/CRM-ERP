import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import {
  PermissionScope,
  PermissionType,
  Status,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

import {
  CompanyBoundaryService,
} from '../services/company-boundary.service';

import type {
  DepartmentAccessBoundary,
} from '../../department/repositories/department.repository';

@Injectable()
export class DepartmentPolicy {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly companyBoundaryService:
      CompanyBoundaryService,
  ) {}

  async resolveAccess(
    userId: bigint,
    permissionCode: string,
  ): Promise<DepartmentAccessBoundary> {
    /*
     * CompanyBoundaryService:
     *
     * - fresh user context resolve karta hai
     * - PLATFORM_OWNER ko company flow me reject karta hai
     * - companyId mandatory karta hai
     */
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        userId,
      );

    /*
     * User ka role + employee OU chahiye.
     */
    const user =
      await this.prisma.user.findFirst({
        where: {
          id:
            userId,

          companyId,

          deletedAt:
            null,
        },

        select: {
          roleId:
            true,

          employee: {
            select: {
              organizationUnitId:
                true,
            },
          },
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'User company context is invalid.',
      );
    }

    /*
     * Same permission ROLE aur USER grant
     * dono se aa sakti hai.
     *
     * Dono scopes preserve karne hain.
     */
    const rolePermissions =
      user.roleId
        ? await this.prisma.rolePermission.findMany({
            where: {
              roleId:
                user.roleId,

              permission: {
                code:
                  permissionCode,

                type:
                  PermissionType.COMPANY,

                status:
                  Status.ACTIVE,

                deletedAt:
                  null,
              },
            },

            select: {
              scope:
                true,
            },
          })
        : [];

    const userPermissions =
      await this.prisma.userPermission.findMany({
        where: {
          userId,

          permission: {
            code:
              permissionCode,

            type:
              PermissionType.COMPANY,

            status:
              Status.ACTIVE,

            deletedAt:
              null,
          },
        },

        select: {
          scope:
            true,
        },
      });

    /*
     * ROLE + USER scopes merge.
     *
     * Set use karne se duplicate scope
     * automatically remove ho jayega.
     */
    const scopes =
      new Set<PermissionScope>([
        ...rolePermissions.map(
          (item) =>
            item.scope,
        ),

        ...userPermissions.map(
          (item) =>
            item.scope,
        ),
      ]);

    if (
      scopes.size ===
      0
    ) {
      throw new ForbiddenException(
        'Permission scope is missing.',
      );
    }

    /*
     * COMPANY sabse broad department
     * boundary hai.
     *
     * Agar ROLE se ORGANIZATION_UNIT
     * aur direct USER grant se COMPANY
     * mila hai, COMPANY access effective
     * hoga.
     */
    if (
      scopes.has(
        PermissionScope.COMPANY,
      )
    ) {
      return {
        companyId,

        /*
         * null = complete company boundary
         */
        organizationUnitIds:
          null,
      };
    }

    /*
     * Department permissions currently:
     *
     * ORGANIZATION_UNIT
     * COMPANY
     *
     * ORGANIZATION_UNIT scope me user's
     * employee OU use hoga.
     */
    if (
      scopes.has(
        PermissionScope.ORGANIZATION_UNIT,
      )
    ) {
      const organizationUnitId =
        user.employee
          ?.organizationUnitId;

      /*
       * User ko OU scoped permission mila,
       * but employee kisi OU se linked nahi.
       *
       * Fail closed:
       * no accessible OUs.
       */
      if (
        !organizationUnitId
      ) {
        return {
          companyId,
          organizationUnitIds:
            [],
        };
      }

      return {
        companyId,

        organizationUnitIds: [
          organizationUnitId,
        ],
      };
    }

    /*
     * Department permission ko OWN / TEAM /
     * PROJECT jaise unsupported scope ke saath
     * execute nahi karna.
     */
    throw new ForbiddenException(
      'Permission scope does not allow department access.',
    );
  }
}