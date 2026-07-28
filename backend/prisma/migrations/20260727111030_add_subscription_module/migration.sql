-- AlterTable
ALTER TABLE "company_subscriptions" ADD COLUMN     "amount" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "durationInDays" INTEGER,
ADD COLUMN     "maxBranches" INTEGER,
ADD COLUMN     "maxProjects" INTEGER,
ADD COLUMN     "maxUsers" INTEGER,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "modules" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "route" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan_modules" (
    "id" BIGSERIAL NOT NULL,
    "subscriptionPlanId" BIGINT NOT NULL,
    "moduleId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_plan_modules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modules_uuid_key" ON "modules"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "modules_code_key" ON "modules"("code");

-- CreateIndex
CREATE INDEX "modules_status_idx" ON "modules"("status");

-- CreateIndex
CREATE INDEX "subscription_plan_modules_subscriptionPlanId_idx" ON "subscription_plan_modules"("subscriptionPlanId");

-- CreateIndex
CREATE INDEX "subscription_plan_modules_moduleId_idx" ON "subscription_plan_modules"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_modules_subscriptionPlanId_moduleId_key" ON "subscription_plan_modules"("subscriptionPlanId", "moduleId");

-- CreateIndex
CREATE INDEX "subscription_plans_isPublic_idx" ON "subscription_plans"("isPublic");

-- AddForeignKey
ALTER TABLE "subscription_plan_modules" ADD CONSTRAINT "subscription_plan_modules_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_modules" ADD CONSTRAINT "subscription_plan_modules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
