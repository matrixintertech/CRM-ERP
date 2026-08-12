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
  DesignationAccessBoundary,
} from '../../designation/repositories/designation.repository';

@Injectable()
export class DesignationPolicy {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly companyBoundaryService:
      CompanyBoundaryService,
  ) {}

  async resolveAccess(
    userId: bigint,
    permissionCode: string,
  ): Promise<DesignationAccessBoundary> {
    /*
     * Fresh company boundary resolve karo.
     *
     * Platform user ko company flow me
     * bypass nahi milega.
     */
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        userId,
      );

    /*
     * User ka role aur primary
     * organization unit resolve karo.
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
     * Role se same permission ke
     * applicable scopes.
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

    /*
     * Direct user grants.
     *
     * UserPermission extra grant hai,
     * deny nahi.
     */
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
     * ROLE + USER scopes preserve karo.
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
     * COMPANY scope means:
     *
     * current company ke saare
     * designations accessible.
     */
    if (
      scopes.has(
        PermissionScope.COMPANY,
      )
    ) {
      return {
        companyId,

        organizationUnitIds:
          null,
      };
    }

    /*
     * ORGANIZATION_UNIT scope:
     *
     * Designation
     *   -> Department
     *      -> Organization Unit
     *
     * Repository isi OU list ke through
     * designation filter karegi.
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
       * Permission OU scoped hai but
       * employee kisi OU se linked nahi.
       *
       * Fail closed.
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
     * Designation ke liye currently
     * sirf COMPANY aur ORGANIZATION_UNIT
     * supported hain.
     */
    throw new ForbiddenException(
      'Permission scope does not allow designation access.',
    );
  }
}