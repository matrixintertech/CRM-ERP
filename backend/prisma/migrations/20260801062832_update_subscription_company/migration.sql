/*
  Warnings:

  - A unique constraint covering the columns `[route]` on the table `modules` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "company_subscriptions" ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "renewalDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "modules_route_key" ON "modules"("route");
