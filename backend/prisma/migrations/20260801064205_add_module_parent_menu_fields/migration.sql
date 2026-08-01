/*
  Warnings:

  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "subscription_plan_modules" DROP CONSTRAINT "subscription_plan_modules_moduleId_fkey";

-- DropTable
DROP TABLE "modules";

-- CreateTable
CREATE TABLE "Module" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "route" TEXT,
    "parentId" BIGINT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isMenu" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_uuid_key" ON "Module"("uuid");

-- CreateIndex
CREATE INDEX "Module_parentId_idx" ON "Module"("parentId");

-- CreateIndex
CREATE INDEX "Module_sortOrder_idx" ON "Module"("sortOrder");

-- CreateIndex
CREATE INDEX "Module_status_idx" ON "Module"("status");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_modules" ADD CONSTRAINT "subscription_plan_modules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
