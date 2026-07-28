import { PrismaClient } from "@prisma/client";
import { PermissionModule } from "../../src/modules/permission/enums/permission-module.enum";

const permissions = [
  // Dashboard
  {
    module: PermissionModule.DASHBOARD,
    name: "View Dashboard",
    code: "dashboard.view",
  },

  // Company
  {
    module: PermissionModule.COMPANY,
    name: "View Company",
    code: "company.view",
  },
  {
    module: PermissionModule.COMPANY,
    name: "Create Company",
    code: "company.create",
  },
  {
    module: PermissionModule.COMPANY,
    name: "Update Company",
    code: "company.update",
  },
  {
    module: PermissionModule.COMPANY,
    name: "Delete Company",
    code: "company.delete",
  },

  // Organization
  {
    module: PermissionModule.ORGANIZATION,
    name: "View Organization",
    code: "organization.view",
  },
  {
    module: PermissionModule.ORGANIZATION,
    name: "Create Organization",
    code: "organization.create",
  },
  {
    module: PermissionModule.ORGANIZATION,
    name: "Update Organization",
    code: "organization.update",
  },
  {
    module: PermissionModule.ORGANIZATION,
    name: "Delete Organization",
    code: "organization.delete",
  },

  // Role
  {
    module: PermissionModule.ROLE,
    name: "View Role",
    code: "role.view",
  },
  {
    module: PermissionModule.ROLE,
    name: "Create Role",
    code: "role.create",
  },
  {
    module: PermissionModule.ROLE,
    name: "Update Role",
    code: "role.update",
  },
  {
    module: PermissionModule.ROLE,
    name: "Delete Role",
    code: "role.delete",
  },
];

export async function seedPermissions(
  prisma: PrismaClient,
) {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {},
      create: permission,
    });
  }

  console.log(
    `Seeded ${permissions.length} permissions.`,
  );
}