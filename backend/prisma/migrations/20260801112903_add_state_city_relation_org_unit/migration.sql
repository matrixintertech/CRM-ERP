/*
  Warnings:

  - You are about to drop the column `city` on the `OrganizationUnit` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `OrganizationUnit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationUnit" DROP COLUMN "city",
DROP COLUMN "state",
ADD COLUMN     "cityId" BIGINT,
ADD COLUMN     "stateId" BIGINT;

-- CreateIndex
CREATE INDEX "OrganizationUnit_stateId_idx" ON "OrganizationUnit"("stateId");

-- CreateIndex
CREATE INDEX "OrganizationUnit_cityId_idx" ON "OrganizationUnit"("cityId");

-- AddForeignKey
ALTER TABLE "OrganizationUnit" ADD CONSTRAINT "OrganizationUnit_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUnit" ADD CONSTRAINT "OrganizationUnit_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
