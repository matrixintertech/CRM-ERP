/*
  Warnings:

  - Added the required column `organizationUnitId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "organizationUnitId" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "Project_organizationUnitId_idx" ON "Project"("organizationUnitId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "OrganizationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
