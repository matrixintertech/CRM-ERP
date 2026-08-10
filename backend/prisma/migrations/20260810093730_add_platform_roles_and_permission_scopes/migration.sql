-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('PLATFORM', 'COMPANY');

-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('OWN', 'TEAM', 'ORGANIZATION_UNIT', 'PROJECT', 'COMPANY');

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "type" "PermissionType" NOT NULL DEFAULT 'COMPANY';

-- AlterTable
ALTER TABLE "RolePermission" ADD COLUMN     "scope" "PermissionScope" NOT NULL DEFAULT 'OWN';

-- AlterTable
ALTER TABLE "user_permissions" ADD COLUMN     "scope" "PermissionScope" NOT NULL DEFAULT 'OWN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "platformRoleId" BIGINT;

-- CreateTable
CREATE TABLE "platform_roles" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "platform_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_role_permissions" (
    "id" BIGSERIAL NOT NULL,
    "platformRoleId" BIGINT NOT NULL,
    "permissionId" BIGINT NOT NULL,

    CONSTRAINT "platform_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_roles_uuid_key" ON "platform_roles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "platform_roles_code_key" ON "platform_roles"("code");

-- CreateIndex
CREATE INDEX "platform_roles_status_idx" ON "platform_roles"("status");

-- CreateIndex
CREATE INDEX "platform_role_permissions_platformRoleId_idx" ON "platform_role_permissions"("platformRoleId");

-- CreateIndex
CREATE INDEX "platform_role_permissions_permissionId_idx" ON "platform_role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_role_permissions_platformRoleId_permissionId_key" ON "platform_role_permissions"("platformRoleId", "permissionId");

-- CreateIndex
CREATE INDEX "Permission_type_idx" ON "Permission"("type");

-- CreateIndex
CREATE INDEX "Permission_type_module_idx" ON "Permission"("type", "module");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "RolePermission_scope_idx" ON "RolePermission"("scope");

-- CreateIndex
CREATE INDEX "user_permissions_scope_idx" ON "user_permissions"("scope");

-- CreateIndex
CREATE INDEX "users_platformRoleId_idx" ON "users"("platformRoleId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_platformRoleId_fkey" FOREIGN KEY ("platformRoleId") REFERENCES "platform_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_role_permissions" ADD CONSTRAINT "platform_role_permissions_platformRoleId_fkey" FOREIGN KEY ("platformRoleId") REFERENCES "platform_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_role_permissions" ADD CONSTRAINT "platform_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
