-- CreateEnum
CREATE TYPE "ProjectTaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "project_tasks" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,
    "assignedProjectMemberId" BIGINT,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "ProjectTaskStatus" NOT NULL DEFAULT 'TODO',
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "project_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_tasks_uuid_key" ON "project_tasks"("uuid");

-- CreateIndex
CREATE INDEX "project_tasks_companyId_idx" ON "project_tasks"("companyId");

-- CreateIndex
CREATE INDEX "project_tasks_projectId_idx" ON "project_tasks"("projectId");

-- CreateIndex
CREATE INDEX "project_tasks_assignedProjectMemberId_idx" ON "project_tasks"("assignedProjectMemberId");

-- CreateIndex
CREATE INDEX "project_tasks_priority_idx" ON "project_tasks"("priority");

-- CreateIndex
CREATE INDEX "project_tasks_status_idx" ON "project_tasks"("status");

-- CreateIndex
CREATE INDEX "project_tasks_dueDate_idx" ON "project_tasks"("dueDate");

-- CreateIndex
CREATE INDEX "project_tasks_deletedAt_idx" ON "project_tasks"("deletedAt");

-- AddForeignKey
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_assignedProjectMemberId_fkey" FOREIGN KEY ("assignedProjectMemberId") REFERENCES "project_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
