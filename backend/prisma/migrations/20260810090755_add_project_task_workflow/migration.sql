-- CreateEnum
CREATE TYPE "ProjectTaskReportType" AS ENUM ('PROGRESS', 'BLOCKER', 'NOTE', 'COMPLETION');

-- CreateEnum
CREATE TYPE "ProjectTaskAttachmentType" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ProjectTaskWorkSessionStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ProjectTaskCompletionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "ProjectTaskStatus" ADD VALUE 'COMPLETION_REQUESTED';

-- CreateTable
CREATE TABLE "project_task_reports" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "taskId" BIGINT NOT NULL,
    "projectMemberId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "type" "ProjectTaskReportType" NOT NULL DEFAULT 'PROGRESS',
    "message" TEXT NOT NULL,
    "taskStatusSnapshot" "ProjectTaskStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_task_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_task_report_attachments" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "reportId" BIGINT NOT NULL,
    "type" "ProjectTaskAttachmentType" NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_task_report_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_task_work_sessions" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "taskId" BIGINT NOT NULL,
    "projectMemberId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "status" "ProjectTaskWorkSessionStatus" NOT NULL DEFAULT 'OPEN',
    "punchInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "punchOutAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "punchInLatitude" DECIMAL(10,7),
    "punchInLongitude" DECIMAL(10,7),
    "punchInAccuracy" DECIMAL(10,2),
    "punchInAddress" TEXT,
    "punchOutLatitude" DECIMAL(10,7),
    "punchOutLongitude" DECIMAL(10,7),
    "punchOutAccuracy" DECIMAL(10,2),
    "punchOutAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_task_work_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_task_completion_requests" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "taskId" BIGINT NOT NULL,
    "requestedByProjectMemberId" BIGINT NOT NULL,
    "requestedByUserId" BIGINT NOT NULL,
    "reportId" BIGINT,
    "status" "ProjectTaskCompletionStatus" NOT NULL DEFAULT 'PENDING',
    "workedSeconds" INTEGER NOT NULL DEFAULT 0,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedByUserId" BIGINT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,

    CONSTRAINT "project_task_completion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_task_reports_uuid_key" ON "project_task_reports"("uuid");

-- CreateIndex
CREATE INDEX "project_task_reports_companyId_idx" ON "project_task_reports"("companyId");

-- CreateIndex
CREATE INDEX "project_task_reports_taskId_idx" ON "project_task_reports"("taskId");

-- CreateIndex
CREATE INDEX "project_task_reports_projectMemberId_idx" ON "project_task_reports"("projectMemberId");

-- CreateIndex
CREATE INDEX "project_task_reports_userId_idx" ON "project_task_reports"("userId");

-- CreateIndex
CREATE INDEX "project_task_reports_createdAt_idx" ON "project_task_reports"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_task_report_attachments_uuid_key" ON "project_task_report_attachments"("uuid");

-- CreateIndex
CREATE INDEX "project_task_report_attachments_reportId_idx" ON "project_task_report_attachments"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "project_task_work_sessions_uuid_key" ON "project_task_work_sessions"("uuid");

-- CreateIndex
CREATE INDEX "project_task_work_sessions_companyId_idx" ON "project_task_work_sessions"("companyId");

-- CreateIndex
CREATE INDEX "project_task_work_sessions_taskId_idx" ON "project_task_work_sessions"("taskId");

-- CreateIndex
CREATE INDEX "project_task_work_sessions_projectMemberId_idx" ON "project_task_work_sessions"("projectMemberId");

-- CreateIndex
CREATE INDEX "project_task_work_sessions_userId_idx" ON "project_task_work_sessions"("userId");

-- CreateIndex
CREATE INDEX "project_task_work_sessions_status_idx" ON "project_task_work_sessions"("status");

-- CreateIndex
CREATE INDEX "project_task_work_sessions_punchInAt_idx" ON "project_task_work_sessions"("punchInAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_task_completion_requests_uuid_key" ON "project_task_completion_requests"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "project_task_completion_requests_reportId_key" ON "project_task_completion_requests"("reportId");

-- CreateIndex
CREATE INDEX "project_task_completion_requests_companyId_idx" ON "project_task_completion_requests"("companyId");

-- CreateIndex
CREATE INDEX "project_task_completion_requests_taskId_idx" ON "project_task_completion_requests"("taskId");

-- CreateIndex
CREATE INDEX "project_task_completion_requests_requestedByProjectMemberId_idx" ON "project_task_completion_requests"("requestedByProjectMemberId");

-- CreateIndex
CREATE INDEX "project_task_completion_requests_requestedByUserId_idx" ON "project_task_completion_requests"("requestedByUserId");

-- CreateIndex
CREATE INDEX "project_task_completion_requests_status_idx" ON "project_task_completion_requests"("status");

-- CreateIndex
CREATE INDEX "project_task_completion_requests_requestedAt_idx" ON "project_task_completion_requests"("requestedAt");

-- AddForeignKey
ALTER TABLE "project_task_reports" ADD CONSTRAINT "project_task_reports_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_reports" ADD CONSTRAINT "project_task_reports_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "project_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_reports" ADD CONSTRAINT "project_task_reports_projectMemberId_fkey" FOREIGN KEY ("projectMemberId") REFERENCES "project_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_reports" ADD CONSTRAINT "project_task_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_report_attachments" ADD CONSTRAINT "project_task_report_attachments_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "project_task_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_work_sessions" ADD CONSTRAINT "project_task_work_sessions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_work_sessions" ADD CONSTRAINT "project_task_work_sessions_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "project_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_work_sessions" ADD CONSTRAINT "project_task_work_sessions_projectMemberId_fkey" FOREIGN KEY ("projectMemberId") REFERENCES "project_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_work_sessions" ADD CONSTRAINT "project_task_work_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_completion_requests" ADD CONSTRAINT "project_task_completion_requests_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_completion_requests" ADD CONSTRAINT "project_task_completion_requests_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "project_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_completion_requests" ADD CONSTRAINT "project_task_completion_requests_requestedByProjectMemberI_fkey" FOREIGN KEY ("requestedByProjectMemberId") REFERENCES "project_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_completion_requests" ADD CONSTRAINT "project_task_completion_requests_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_completion_requests" ADD CONSTRAINT "project_task_completion_requests_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "project_task_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_completion_requests" ADD CONSTRAINT "project_task_completion_requests_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
