import {
  PermissionType,
  PrismaClient,
  UserType,
} from "@prisma/client";

import {
  COMPANY_ADMIN_PERMISSION_TEMPLATE,
} from "../../src/modules/authorization/permissions/company-admin-template";

import {
  COMPANY_ADMIN_ROLE_CODE,
  COMPANY_ADMIN_ROLE_NAME,
} from "../../src/modules/authorization/services/company-authorization-bootstrap.service";


export async function seedCompanyAdminSync(
  prisma: PrismaClient,
) {
  console.log(
    "🔐 Syncing existing Company Admin roles...",
  );


  /*
   * ---------------------------------------------------------
   * 1. Required permissions only
   * ---------------------------------------------------------
   *
   * Existing companies ke optional permissions ko
   * forcefully re-add nahi karna.
   *
   * required = true
   * → always guaranteed
   *
   * required = false
   * → company customization preserve
   */
  const requiredTemplate =
    COMPANY_ADMIN_PERMISSION_TEMPLATE.filter(
      (permission) =>
        permission.required,
    );


  if (requiredTemplate.length === 0) {
    throw new Error(
      "Company Admin template does not contain any required permissions.",
    );
  }


  /*
   * Duplicate configuration protection.
   */
  const requiredCodes =
    requiredTemplate.map(
      (permission) =>
        permission.code,
    );


  const uniqueRequiredCodes =
    new Set(
      requiredCodes,
    );


  if (
    uniqueRequiredCodes.size !==
    requiredCodes.length
  ) {
    throw new Error(
      "Company Admin template contains duplicate required permission codes.",
    );
  }


  /*
   * ---------------------------------------------------------
   * 2. Resolve required permissions
   * ---------------------------------------------------------
   */
  const permissions =
    await prisma.permission.findMany({
      where: {
        code: {
          in:
            requiredCodes,
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
   * ---------------------------------------------------------
   * 3. Validate required permissions
   * ---------------------------------------------------------
   *
   * Sync silently incomplete nahi hona chahiye.
   * Agar catalog/DB configuration invalid hai,
   * seed fail hona better hai.
   */
  for (
    const templatePermission
    of requiredTemplate
  ) {
    const permission =
      permissionByCode.get(
        templatePermission.code,
      );


    if (!permission) {
      throw new Error(
        `Required Company Admin permission is missing: ${templatePermission.code}`,
      );
    }


    if (
      permission.type !==
      PermissionType.COMPANY
    ) {
      throw new Error(
        `Required Company Admin permission must be type COMPANY: ${templatePermission.code}`,
      );
    }


    if (
      permission.status !==
        "ACTIVE" ||
      permission.deletedAt !==
        null
    ) {
      throw new Error(
        `Required Company Admin permission is not active: ${templatePermission.code}`,
      );
    }


    if (
      !permission.allowedScopes.includes(
        templatePermission.scope,
      )
    ) {
      throw new Error(
        `Scope ${templatePermission.scope} is not allowed for required permission ${templatePermission.code}`,
      );
    }
  }


  /*
   * ---------------------------------------------------------
   * 4. Load all active/non-deleted companies
   * ---------------------------------------------------------
   */
  const companies =
    await prisma.company.findMany({
      where: {
        deletedAt:
          null,
      },

      select: {
        id:
          true,

        name:
          true,

        code:
          true,
      },

      orderBy: {
        id:
          "asc",
      },
    });


  let rolesCreated =
    0;

  let rolesRepaired =
    0;

  let requiredPermissionsAdded =
    0;

  let adminUsersLinked =
    0;


  /*
   * ---------------------------------------------------------
   * 5. Repair every existing company
   * ---------------------------------------------------------
   */
  for (
    const company
    of companies
  ) {
    await prisma.$transaction(
      async (tx) => {
        /*
         * ---------------------------------------------------
         * A. Ensure COMPANY_ADMIN system role
         * ---------------------------------------------------
         *
         * Soft-deleted role bhi search karte hain so it can
         * be restored instead of creating a duplicate.
         */
        const existingRole =
          await tx.role.findFirst({
            where: {
              companyId:
                company.id,

              code:
                COMPANY_ADMIN_ROLE_CODE,
            },
          });


        let companyAdminRole;


        if (existingRole) {
          const requiresRepair =
            existingRole.name !==
              COMPANY_ADMIN_ROLE_NAME ||
            existingRole.isSystem !==
              true ||
            existingRole.status !==
              "ACTIVE" ||
            existingRole.deletedAt !==
              null;


          if (requiresRepair) {
            rolesRepaired +=
              1;
          }


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
                companyId:
                  company.id,

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


          rolesCreated +=
            1;
        }


        /*
         * ---------------------------------------------------
         * B. Ensure REQUIRED RolePermission grants
         * ---------------------------------------------------
         *
         * Optional template permissions are intentionally
         * NOT touched here.
         */
        for (
          const templatePermission
          of requiredTemplate
        ) {
          const permission =
            permissionByCode.get(
              templatePermission.code,
            );


          if (!permission) {
            /*
             * Already validated above.
             * Runtime safety only.
             */
            throw new Error(
              `Unable to resolve required permission: ${templatePermission.code}`,
            );
          }


          const existingRolePermission =
            await tx.rolePermission.findUnique({
              where: {
                roleId_permissionId: {
                  roleId:
                    companyAdminRole.id,

                  permissionId:
                    permission.id,
                },
              },
            });


          if (!existingRolePermission) {
            await tx.rolePermission.create({
              data: {
                roleId:
                  companyAdminRole.id,

                permissionId:
                  permission.id,

                scope:
                  templatePermission.scope,
              },
            });


            requiredPermissionsAdded +=
              1;
          } else if (
            existingRolePermission.scope !==
            templatePermission.scope
          ) {
            /*
             * Required permission ka required scope
             * authoritative hai.
             */
            await tx.rolePermission.update({
              where: {
                id:
                  existingRolePermission.id,
              },

              data: {
                scope:
                  templatePermission.scope,
              },
            });
          }
        }


        /*
         * ---------------------------------------------------
         * C. Link existing Company Admin user to system role
         * ---------------------------------------------------
         *
         * UserType account boundary/category hai.
         * Authorization actual roleId se aayegi.
         */
        const existingAdminUser =
          await tx.user.findFirst({
            where: {
              companyId:
                company.id,

              userType:
                UserType.COMPANY_ADMIN,
            },

            select: {
              id:
                true,

              roleId:
                true,
            },
          });


        if (
          existingAdminUser &&
          existingAdminUser.roleId !==
            companyAdminRole.id
        ) {
          await tx.user.update({
            where: {
              id:
                existingAdminUser.id,
            },

            data: {
              role: {
                connect: {
                  id:
                    companyAdminRole.id,
                },
              },
            },
          });


          adminUsersLinked +=
            1;
        }
      },
    );
  }


  console.log(
    `✅ Company Admin sync complete. Companies: ${companies.length}, roles created: ${rolesCreated}, roles repaired: ${rolesRepaired}, required grants added: ${requiredPermissionsAdded}, admin users linked: ${adminUsersLinked}.`,
  );
}