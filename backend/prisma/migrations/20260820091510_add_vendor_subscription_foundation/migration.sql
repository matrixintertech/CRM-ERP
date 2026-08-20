-- CreateEnum
CREATE TYPE "VendorPlanType" AS ENUM ('FREE', 'PAID', 'LIFETIME');

-- CreateEnum
CREATE TYPE "VendorSubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VendorSubscriptionBillingCycle" AS ENUM ('NONE', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');

-- CreateTable
CREATE TABLE "vendor_subscription_plans" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "planType" "VendorPlanType" NOT NULL,
    "billingCycle" "VendorSubscriptionBillingCycle" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "durationInDays" INTEGER,
    "marketplaceVisible" BOOLEAN NOT NULL DEFAULT true,
    "maxServiceAreas" INTEGER,
    "maxCategories" INTEGER,
    "canReceiveRfqs" BOOLEAN NOT NULL DEFAULT true,
    "canSubmitQuotations" BOOLEAN NOT NULL DEFAULT true,
    "priorityListing" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_subscriptions" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "planId" BIGINT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "amount" DECIMAL(10,2),
    "status" "VendorSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_subscription_plans_uuid_key" ON "vendor_subscription_plans"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_subscription_plans_code_key" ON "vendor_subscription_plans"("code");

-- CreateIndex
CREATE INDEX "vendor_subscription_plans_planType_idx" ON "vendor_subscription_plans"("planType");

-- CreateIndex
CREATE INDEX "vendor_subscription_plans_billingCycle_idx" ON "vendor_subscription_plans"("billingCycle");

-- CreateIndex
CREATE INDEX "vendor_subscription_plans_status_idx" ON "vendor_subscription_plans"("status");

-- CreateIndex
CREATE INDEX "vendor_subscription_plans_sortOrder_idx" ON "vendor_subscription_plans"("sortOrder");

-- CreateIndex
CREATE INDEX "vendor_subscription_plans_deletedAt_idx" ON "vendor_subscription_plans"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_subscriptions_uuid_key" ON "vendor_subscriptions"("uuid");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_vendorId_idx" ON "vendor_subscriptions"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_planId_idx" ON "vendor_subscriptions"("planId");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_status_idx" ON "vendor_subscriptions"("status");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_isCurrent_idx" ON "vendor_subscriptions"("isCurrent");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_startDate_idx" ON "vendor_subscriptions"("startDate");

-- CreateIndex
CREATE INDEX "vendor_subscriptions_endDate_idx" ON "vendor_subscriptions"("endDate");

-- AddForeignKey
ALTER TABLE "vendor_subscriptions" ADD CONSTRAINT "vendor_subscriptions_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_subscriptions" ADD CONSTRAINT "vendor_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "vendor_subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
