/*
  Warnings:

  - Added the required column `categoryId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "categoryId" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "project_categories" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(20),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "project_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_uuid_key" ON "project_categories"("uuid");

-- CreateIndex
CREATE INDEX "project_categories_companyId_idx" ON "project_categories"("companyId");

-- CreateIndex
CREATE INDEX "project_categories_status_idx" ON "project_categories"("status");

-- CreateIndex
CREATE INDEX "project_categories_sortOrder_idx" ON "project_categories"("sortOrder");

-- CreateIndex
CREATE INDEX "project_categories_deletedAt_idx" ON "project_categories"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_companyId_name_key" ON "project_categories"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_companyId_code_key" ON "project_categories"("companyId", "code");

-- CreateIndex
CREATE INDEX "Project_categoryId_idx" ON "Project"("categoryId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "project_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
