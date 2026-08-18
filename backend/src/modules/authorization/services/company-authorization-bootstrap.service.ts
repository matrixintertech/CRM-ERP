import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";

import {
  PermissionScope,
  PermissionType,
  Prisma,
  Role,
} from "@prisma/client";

import {
  COMPANY_ADMIN_PERMISSION_TEMPLATE,
} from "../permissions/company-admin-template";


export const COMPANY_ADMIN_ROLE_CODE =
  "COMPANY_ADMIN";

export const COMPANY_ADMIN_ROLE_NAME =
  "Company Admin";


@Injectable()
export class CompanyAuthorizationBootstrapService {
  /**
   * Creates/restores the per-company Company Admin
   * system role and assigns the complete Company Admin
   * default permission template.
   *
   * IMPORTANT:
   * This method does NOT start its own transaction.
   *
   * Company creation service must pass its existing
   * Prisma transaction client so:
   *
   * Company
   *   -> Company Admin Role
   *   -> Role Permissions
   *   -> Initial Admin User
   *
   * all commit/rollback together.
   */
  async bootstrapCompanyAdminRole(
    tx: Prisma.TransactionClient,
    companyId: bigint,
  ): Promise<Role> {
    /*
     * -------------------------------------------------------
     * 1. Ensure Company Admin system role
     * -------------------------------------------------------
     *
     * We intentionally search including soft-deleted roles.
     *
     * Reason:
     * If the database has a unique constraint such as
     * companyId + code, creating another COMPANY_ADMIN
     * could fail if an old soft-deleted row still exists.
     *
     * In that case we restore the existing system role.
     */
    const existingRole =
      await tx.role.findFirst({
        where: {
          companyId,
          code:
            COMPANY_ADMIN_ROLE_CODE,
        },
      });


    let companyAdminRole: Role;


    if (existingRole) {
      companyAdminRole =
        await tx.role.update({
          where: {
            id:
              existingRole.id,
          },

          data: {
            name:
              COMPANY_ADMIN_ROLE_NAME,

            code:
              COMPANY_ADMIN_ROLE_CODE,

            isSystem:
              true,

            status:
              "ACTIVE",

            deletedAt:
              null,
          },
        });
    } else {
      companyAdminRole =
        await tx.role.create({
          data: {
            companyId,

            name:
              COMPANY_ADMIN_ROLE_NAME,

            code:
              COMPANY_ADMIN_ROLE_CODE,

            isSystem:
              true,

            status:
              "ACTIVE",
          },
        });
    }


    /*
     * -------------------------------------------------------
     * 2. Validate Company Admin template
     * -------------------------------------------------------
     */
    const templateCodes =
      COMPANY_ADMIN_PERMISSION_TEMPLATE.map(
        (permission) =>
          permission.code,
      );


    /*
     * Duplicate permission codes inside the template
     * would be a programming/configuration error.
     */
    const uniqueTemplateCodes =
      new Set(
        templateCodes,
      );


    if (
      uniqueTemplateCodes.size !==
      templateCodes.length
    ) {
      throw new InternalServerErrorException(
        "Company Admin permission template contains duplicate permission codes.",
      );
    }


    /*
     * Load permissions by code without filtering type/status
     * first.
     *
     * This lets us produce a meaningful configuration error
     * if a permission exists but has the wrong type/status.
     */
    const permissions =
      await tx.permission.findMany({
        where: {
          code: {
            in:
              templateCodes,
          },
        },

        select: {
          id:
            true,

          code:
            true,

          type:
            true,

          status:
            true,

          deletedAt:
            true,

          allowedScopes:
            true,
        },
      });


    const permissionByCode =
      new Map(
        permissions.map(
          (permission) => [
            permission.code,
            permission,
          ],
        ),
      );


    /*
     * -------------------------------------------------------
     * 3. Validate every template permission
     * -------------------------------------------------------
     *
     * Bootstrap should fail loudly rather than silently
     * creating an incomplete Company Admin role.
     *
     * Since this runs inside company creation transaction,
     * failure will cause company creation to rollback.
     */
    for (
      const templatePermission
      of COMPANY_ADMIN_PERMISSION_TEMPLATE
    ) {
      const permission =
        permissionByCode.get(
          templatePermission.code,
        );


      if (!permission) {
        throw new InternalServerErrorException(
          `Company Admin permission is missing from the permission catalog/database: ${templatePermission.code}`,
        );
      }


      /*
       * Company Admin role can only receive COMPANY
       * permissions.
       *
       * PLATFORM permissions must never leak into a tenant
       * company role.
       */
      if (
        permission.type !==
        PermissionType.COMPANY
      ) {
        throw new InternalServerErrorException(
          `Company Admin permission must be type COMPANY: ${templatePermission.code}`,
        );
      }


      if (
        permission.status !==
        "ACTIVE" ||
        permission.deletedAt !==
        null
      ) {
        throw new InternalServerErrorException(
          `Company Admin permission is not active: ${templatePermission.code}`,
        );
      }


      /*
       * Template cannot assign a scope that the permission
       * itself does not allow.
       */
      if (
        !permission.allowedScopes.includes(
          templatePermission.scope,
        )
      ) {
        throw new InternalServerErrorException(
          `Invalid Company Admin scope ${templatePermission.scope} for permission ${templatePermission.code}`,
        );
      }
    }


    /*
     * -------------------------------------------------------
     * 4. Sync RolePermission rows
     * -------------------------------------------------------
     *
     * New company bootstrap receives ALL template entries:
     *
     * required: true
     *   -> default grant + cannot later be removed
     *
     * required: false
     *   -> default grant but may later be customized
     *
     * Existing-company repair/sync will be implemented
     * separately and will only force required grants.
     */
    for (
      const templatePermission
      of COMPANY_ADMIN_PERMISSION_TEMPLATE
    ) {
      const permission =
        permissionByCode.get(
          templatePermission.code,
        );


      /*
       * Already validated above.
       * This guard only satisfies runtime safety.
       */
      if (!permission) {
        throw new InternalServerErrorException(
          `Unable to resolve permission: ${templatePermission.code}`,
        );
      }


      await tx.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId:
              companyAdminRole.id,

            permissionId:
              permission.id,
          },
        },

        create: {
          roleId:
            companyAdminRole.id,

          permissionId:
            permission.id,

          scope:
            templatePermission.scope,
        },

        update: {
          /*
           * During NEW company bootstrap the template
           * is authoritative, so scope is synchronized.
           */
          scope:
            templatePermission.scope,
        },
      });
    }


    return companyAdminRole;
  }
}