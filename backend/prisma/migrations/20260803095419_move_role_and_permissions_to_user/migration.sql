/*
  Warnings:

  - You are about to drop the column `roleId` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the `employee_permissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "employee_permissions" DROP CONSTRAINT "employee_permissions_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "employee_permissions" DROP CONSTRAINT "employee_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_roleId_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "roleId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "employeeId" BIGINT,
ADD COLUMN     "roleId" BIGINT;

-- DropTable
DROP TABLE "employee_permissions";

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "permissionId" BIGINT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_permissions_userId_idx" ON "user_permissions"("userId");

-- CreateIndex
CREATE INDEX "user_permissions_permissionId_idx" ON "user_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permissionId_key" ON "user_permissions"("userId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE INDEX "users_employeeId_idx" ON "users"("employeeId");

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
