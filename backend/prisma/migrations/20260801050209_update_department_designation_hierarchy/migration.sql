/*
  Warnings:

  - A unique constraint covering the columns `[companyId,organizationUnitId,name]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,organizationUnitId,code]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,departmentId,name]` on the table `designations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,departmentId,code]` on the table `designations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationUnitId` to the `departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `designations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "departments_companyId_code_key";

-- DropIndex
DROP INDEX "departments_companyId_name_key";

-- DropIndex
DROP INDEX "designations_companyId_code_key";

-- DropIndex
DROP INDEX "designations_companyId_name_key";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "organizationUnitId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "designations" ADD COLUMN     "departmentId" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "departments_organizationUnitId_idx" ON "departments"("organizationUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_companyId_organizationUnitId_name_key" ON "departments"("companyId", "organizationUnitId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_companyId_organizationUnitId_code_key" ON "departments"("companyId", "organizationUnitId", "code");

-- CreateIndex
CREATE INDEX "designations_departmentId_idx" ON "designations"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "designations_companyId_departmentId_name_key" ON "designations"("companyId", "departmentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "designations_companyId_departmentId_code_key" ON "designations"("companyId", "departmentId", "code");

-- AddForeignKey
ALTER TABLE "designations" ADD CONSTRAINT "designations_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "OrganizationUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
