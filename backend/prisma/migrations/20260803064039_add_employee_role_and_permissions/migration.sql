-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "roleId" BIGINT;

-- CreateTable
CREATE TABLE "employee_permissions" (
    "id" BIGSERIAL NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "permissionId" BIGINT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee_permissions_employeeId_idx" ON "employee_permissions"("employeeId");

-- CreateIndex
CREATE INDEX "employee_permissions_permissionId_idx" ON "employee_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_permissions_employeeId_permissionId_key" ON "employee_permissions"("employeeId", "permissionId");

-- AddForeignKey
ALTER TABLE "employee_permissions" ADD CONSTRAINT "employee_permissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_permissions" ADD CONSTRAINT "employee_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
