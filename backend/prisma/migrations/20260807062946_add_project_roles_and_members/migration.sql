-- CreateTable
CREATE TABLE "project_roles" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "isSingleAssignee" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "project_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "projectRoleId" BIGINT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_roles_uuid_key" ON "project_roles"("uuid");

-- CreateIndex
CREATE INDEX "project_roles_companyId_idx" ON "project_roles"("companyId");

-- CreateIndex
CREATE INDEX "project_roles_status_idx" ON "project_roles"("status");

-- CreateIndex
CREATE INDEX "project_roles_sortOrder_idx" ON "project_roles"("sortOrder");

-- CreateIndex
CREATE INDEX "project_roles_deletedAt_idx" ON "project_roles"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_roles_companyId_name_key" ON "project_roles"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "project_roles_companyId_code_key" ON "project_roles"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_uuid_key" ON "project_members"("uuid");

-- CreateIndex
CREATE INDEX "project_members_companyId_idx" ON "project_members"("companyId");

-- CreateIndex
CREATE INDEX "project_members_projectId_idx" ON "project_members"("projectId");

-- CreateIndex
CREATE INDEX "project_members_employeeId_idx" ON "project_members"("employeeId");

-- CreateIndex
CREATE INDEX "project_members_projectRoleId_idx" ON "project_members"("projectRoleId");

-- CreateIndex
CREATE INDEX "project_members_projectId_projectRoleId_idx" ON "project_members"("projectId", "projectRoleId");

-- CreateIndex
CREATE INDEX "project_members_projectId_employeeId_idx" ON "project_members"("projectId", "employeeId");

-- CreateIndex
CREATE INDEX "project_members_isActive_idx" ON "project_members"("isActive");

-- AddForeignKey
ALTER TABLE "project_roles" ADD CONSTRAINT "project_roles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectRoleId_fkey" FOREIGN KEY ("projectRoleId") REFERENCES "project_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
