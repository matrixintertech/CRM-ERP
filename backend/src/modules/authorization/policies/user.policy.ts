import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

import {
  PermissionScope,
  PermissionType,
  Status,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

import {
  CompanyBoundaryService,
} from "../services/company-boundary.service";

import type {
  UserAccessBoundary,
} from "../../user/repositories/user.repository";

@Injectable()
export class UserPolicy {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly companyBoundaryService:
      CompanyBoundaryService,
  ) {}

  async resolveAccess(
    userId: bigint,
    permissionCode: string,
  ): Promise<UserAccessBoundary> {
    /*
     * Fresh company boundary.
     *
     * No PLATFORM_OWNER / COMPANY_ADMIN
     * authorization bypass.
     */
    const companyId =
      await this.companyBoundaryService.getCompanyId(
        userId,
      );

    /*
     * Actor context.
     *
     * Employee.organizationUnitId OU scope
     * resolve karne ke liye required hai.
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
          id:
            true,

          roleId:
            true,

          employee: {
            select: {
              id:
                true,

              organizationUnitId:
                true,
            },
          },
        },
      });

    if (!user) {
      throw new ForbiddenException(
        "User company context is invalid.",
      );
    }

    /*
     * Role grants.
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
     * UserPermission = extra grant,
     * never deny.
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
     * Same permission ke multiple scopes
     * preserve karo.
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
        "Permission scope is missing.",
      );
    }

    /*
     * COMPANY overrides narrower
     * resource boundaries.
     */
    if (
      scopes.has(
        PermissionScope.COMPANY,
      )
    ) {
      return {
        companyId,

        companyAccess:
          true,

        directUserIds:
          [],

        organizationUnitIds:
          [],
      };
    }

    const directUserIds:
      bigint[] = [];

    const organizationUnitIds:
      bigint[] = [];

    /*
     * OWN
     *
     * Target User.id must equal
     * authenticated actor User.id.
     */
    if (
      scopes.has(
        PermissionScope.OWN,
      )
    ) {
      directUserIds.push(
        user.id,
      );
    }

    /*
     * ORGANIZATION_UNIT
     *
     * User
     *   -> Employee
     *      -> organizationUnitId
     */
    if (
      scopes.has(
        PermissionScope.ORGANIZATION_UNIT,
      )
    ) {
      const organizationUnitId =
        user.employee
          ?.organizationUnitId;

      if (
        organizationUnitId
      ) {
        organizationUnitIds.push(
          organizationUnitId,
        );
      }

      /*
       * Employee OU missing ho to empty
       * boundary hi rahegi.
       *
       * Company access me widen nahi karna.
       */
    }

    /*
     * TEAM
     *
     * Actual TEAM relation/model abhi
     * confirmed nahi hai.
     *
     * Isliye guessing karke manager/team
     * access widen nahi kar rahe.
     *
     * Employee authorization refactor me
     * actual reporting hierarchy milne ke
     * baad yahan team User IDs resolve
     * karke directUserIds me add karenge.
     */
    if (
      scopes.has(
        PermissionScope.TEAM,
      )
    ) {
      const teamUserIds =
        await this.resolveTeamUserIds(
          user.id,
          companyId,
        );

      directUserIds.push(
        ...teamUserIds,
      );
    }

    /*
     * PROJECT scope User resource ke liye
     * currently supported nahi hai.
     *
     * Agar permission configuration galat
     * hai aur sirf unsupported scopes mile,
     * fail closed.
     */
    const uniqueDirectUserIds =
      Array.from(
        new Set(
          directUserIds,
        ),
      );

    const uniqueOrganizationUnitIds =
      Array.from(
        new Set(
          organizationUnitIds,
        ),
      );

    if (
      uniqueDirectUserIds.length ===
        0 &&
      uniqueOrganizationUnitIds.length ===
        0
    ) {
      throw new ForbiddenException(
        "Permission scope does not allow user access.",
      );
    }

    return {
      companyId,

      companyAccess:
        false,

      directUserIds:
        uniqueDirectUserIds,

      organizationUnitIds:
        uniqueOrganizationUnitIds,
    };
  }

  /*
   * TEAM resolution intentionally
   * fail-closed for now.
   *
   * Do NOT invent a manager/team relation.
   *
   * Employee schema/reporting hierarchy
   * confirm hone ke baad implementation
   * yahan add karenge.
   */
  private async resolveTeamUserIds(
    _userId: bigint,
    _companyId: bigint,
  ): Promise<bigint[]> {
    return [];
  }
}