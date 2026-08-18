import {
  PermissionType,
  PrismaClient,
} from "@prisma/client";

import {
  COMPANY_ADMIN_PERMISSION_TEMPLATE,
} from "../../src/modules/authorization/permissions/company-admin-template";

import {
  COMPANY_ADMIN_ROLE_CODE,
  COMPANY_ADMIN_ROLE_NAME,
} from "../../src/modules/authorization/services/company-authorization-bootstrap.service";


const prisma =
  new PrismaClient();


async function main() {
  console.log(
    "🔐 Backfilling Company Admin default permissions...",
  );


  /*
   * =========================================================
   * 1. Validate template
   * =========================================================
   */
  const templateCodes =
    COMPANY_ADMIN_PERMISSION_TEMPLATE.map(
      (permission) =>
        permission.code,
    );


  const uniqueTemplateCodes =
    new Set(
      templateCodes,
    );


  if (
    uniqueTemplateCodes.size !==
    templateCodes.length
  ) {
    throw new Error(
      "Company Admin template contains duplicate permission codes.",
    );
  }


  /*
   * =========================================================
   * 2. Load all template permissions
   * =========================================================
   */
  const permissions =
    await prisma.permission.findMany({
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
   * =========================================================
   * 3. Validate permission catalog
   * =========================================================
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
      throw new Error(
        `Company Admin permission is missing: ${templatePermission.code}`,
      );
    }


    if (
      permission.type !==
      PermissionType.COMPANY
    ) {
      throw new Error(
        `Company Admin permission must be COMPANY type: ${templatePermission.code}`,
      );
    }


    if (
      permission.status !==
        "ACTIVE" ||
      permission.deletedAt !==
        null
    ) {
      throw new Error(
        `Company Admin permission is not active: ${templatePermission.code}`,
      );
    }


    if (
      !permission.allowedScopes.includes(
        templatePermission.scope,
      )
    ) {
      throw new Error(
        `Template scope ${templatePermission.scope} is not allowed for ${templatePermission.code}`,
      );
    }
  }


  /*
   * =========================================================
   * 4. Existing companies
   * =========================================================
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


  let rolesProcessed =
    0;

  let rolesRepaired =
    0;

  let permissionsAdded =
    0;

  let permissionsAlreadyPresent =
    0;

  let requiredScopesRepaired =
    0;


  /*
   * =========================================================
   * 5. Backfill each Company Admin role
   * =========================================================
   */
  for (
    const company
    of companies
  ) {
    await prisma.$transaction(
      async (tx) => {
        const existingRole =
          await tx.role.findFirst({
            where: {
              companyId:
                company.id,

              code:
                COMPANY_ADMIN_ROLE_CODE,
            },
          });


        /*
         * Permanent company-admin-sync.seed.ts
         * normally guarantees this role exists.
         *
         * Backfill intentionally does not create a
         * brand-new Company Admin role because new-role
         * bootstrap belongs to the application/bootstrap flow.
         */
        if (!existingRole) {
          console.warn(
            `⚠️ COMPANY_ADMIN role not found for company ${company.code} (${company.id}). Skipping.`,
          );

          return;
        }


        rolesProcessed +=
          1;


        /*
         * Repair basic system-role state as defensive
         * protection for old legacy records.
         */
        const needsRoleRepair =
          existingRole.name !==
            COMPANY_ADMIN_ROLE_NAME ||
          existingRole.isSystem !==
            true ||
          existingRole.status !==
            "ACTIVE" ||
          existingRole.deletedAt !==
            null;


        const companyAdminRole =
          needsRoleRepair
            ? await tx.role.update({
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
              })
            : existingRole;


        if (
          needsRoleRepair
        ) {
          rolesRepaired +=
            1;
        }


        /*
         * ===================================================
         * Add missing DEFAULT grants
         * ===================================================
         *
         * IMPORTANT:
         *
         * Missing permission:
         *   -> add using template scope
         *
         * Existing optional permission:
         *   -> leave untouched
         *
         * Existing required permission:
         *   -> required scope may be repaired
         *
         * Isse future customization overwrite nahi hogi.
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
            throw new Error(
              `Unable to resolve permission ${templatePermission.code}`,
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


          /*
           * Missing default grant.
           */
          if (
            !existingRolePermission
          ) {
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


            permissionsAdded +=
              1;

            continue;
          }


          permissionsAlreadyPresent +=
            1;


          /*
           * Required scope is authoritative.
           *
           * Optional permission scope ko intentionally
           * overwrite nahi karenge.
           */
          if (
            templatePermission.required &&
            existingRolePermission.scope !==
              templatePermission.scope
          ) {
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


            requiredScopesRepaired +=
              1;
          }
        }
      },
    );
  }


  console.log(
    [
      "✅ Company Admin defaults backfill complete.",
      `Companies: ${companies.length}`,
      `Roles processed: ${rolesProcessed}`,
      `Roles repaired: ${rolesRepaired}`,
      `Permissions added: ${permissionsAdded}`,
      `Already present: ${permissionsAlreadyPresent}`,
      `Required scopes repaired: ${requiredScopesRepaired}`,
    ].join(" | "),
  );
}


main()
  .catch(
    (error) => {
      console.error(
        "❌ Company Admin defaults backfill failed.",
      );

      console.error(
        error,
      );

      process.exit(1);
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );