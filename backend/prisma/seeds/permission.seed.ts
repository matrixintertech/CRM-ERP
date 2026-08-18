import {
  PermissionType,
  PrismaClient,
} from "@prisma/client";

import {
  PERMISSION_CATALOG,
} from "../../src/modules/authorization/permissions/permission-catalog";


export async function seedPermissions(
  prisma: PrismaClient,
) {
  console.log(
    "🔐 Syncing permission catalog...",
  );


  /*
   * ---------------------------------------------------------
   * Validate duplicate permission codes
   * ---------------------------------------------------------
   *
   * Permission.code system-wide unique hona chahiye.
   * Agar catalog me accidentally same code 2 baar aa gaya,
   * seed immediately fail karega.
   */
  const permissionCodes =
    new Set<string>();


  for (
    const permission
    of PERMISSION_CATALOG
  ) {
    if (
      permissionCodes.has(
        permission.code,
      )
    ) {
      throw new Error(
        `Duplicate permission code in catalog: ${permission.code}`,
      );
    }

    permissionCodes.add(
      permission.code,
    );


    /*
     * -------------------------------------------------------
     * PLATFORM permission validation
     * -------------------------------------------------------
     *
     * Platform permissions tenant data scopes
     * use nahi karte.
     */
    if (
      permission.type ===
        PermissionType.PLATFORM &&
      permission.allowedScopes.length >
        0
    ) {
      throw new Error(
        `Platform permission cannot define allowedScopes: ${permission.code}`,
      );
    }


    /*
     * -------------------------------------------------------
     * COMPANY permission validation
     * -------------------------------------------------------
     *
     * Company permission ke paas kam se kam
     * ek allowed data scope hona chahiye.
     */
    if (
      permission.type ===
        PermissionType.COMPANY &&
      permission.allowedScopes.length ===
        0
    ) {
      throw new Error(
        `Company permission must define allowedScopes: ${permission.code}`,
      );
    }
  }


  /*
   * ---------------------------------------------------------
   * Sync permissions
   * ---------------------------------------------------------
   *
   * Important:
   *
   * - existing permission -> update
   * - missing permission  -> create
   * - soft deleted        -> restore
   * - catalog ke bahar DB permission -> untouched
   *
   * Hum deleteMany/createMany use nahi kar rahe.
   */
  for (
    const permission
    of PERMISSION_CATALOG
  ) {
    await prisma.permission.upsert({
      where: {
        code:
          permission.code,
      },

      create: {
        module:
          permission.module,

        name:
          permission.name,

        code:
          permission.code,

        description:
          permission.description ??
          null,

        type:
          permission.type,

        allowedScopes:
          permission.allowedScopes,

        status:
          "ACTIVE",

        deletedAt:
          null,
      },

      update: {
        module:
          permission.module,

        name:
          permission.name,

        description:
          permission.description ??
          null,

        type:
          permission.type,

        allowedScopes:
          permission.allowedScopes,

        status:
          "ACTIVE",

        /*
         * Catalog me present permission
         * canonical active permission hai.
         */
        deletedAt:
          null,
      },
    });
  }


  console.log(
    `✅ Synced ${PERMISSION_CATALOG.length} permissions.`,
  );
}