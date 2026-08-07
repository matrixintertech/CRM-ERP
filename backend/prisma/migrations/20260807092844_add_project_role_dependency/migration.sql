-- AlterTable
ALTER TABLE "project_roles" ADD COLUMN     "requiredRoleId" BIGINT;

-- CreateIndex
CREATE INDEX "project_roles_requiredRoleId_idx" ON "project_roles"("requiredRoleId");

-- AddForeignKey
ALTER TABLE "project_roles" ADD CONSTRAINT "project_roles_requiredRoleId_fkey" FOREIGN KEY ("requiredRoleId") REFERENCES "project_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
