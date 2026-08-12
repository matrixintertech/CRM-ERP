-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "allowedScopes" "PermissionScope"[] DEFAULT ARRAY[]::"PermissionScope"[];

-- AlterTable
ALTER TABLE "RolePermission" ALTER COLUMN "scope" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_permissions" ALTER COLUMN "scope" DROP DEFAULT;
