-- CreateEnum
CREATE TYPE "VendorContactType" AS ENUM ('OWNER', 'SALES', 'ACCOUNTS', 'PURCHASE', 'DISPATCH', 'SUPPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "VendorAddressType" AS ENUM ('REGISTERED_OFFICE', 'BILLING', 'WAREHOUSE', 'BRANCH', 'OTHER');

-- CreateTable
CREATE TABLE "vendor_contacts" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "designation" VARCHAR(100),
    "type" "VendorContactType" NOT NULL DEFAULT 'OTHER',
    "mobile" VARCHAR(20),
    "email" VARCHAR(150),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_addresses" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "type" "VendorAddressType" NOT NULL DEFAULT 'OTHER',
    "label" VARCHAR(100),
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "stateId" BIGINT,
    "cityId" BIGINT,
    "pincode" VARCHAR(10),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "contactName" VARCHAR(150),
    "contactMobile" VARCHAR(20),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_contacts_uuid_key" ON "vendor_contacts"("uuid");

-- CreateIndex
CREATE INDEX "vendor_contacts_vendorId_idx" ON "vendor_contacts"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_contacts_type_idx" ON "vendor_contacts"("type");

-- CreateIndex
CREATE INDEX "vendor_contacts_email_idx" ON "vendor_contacts"("email");

-- CreateIndex
CREATE INDEX "vendor_contacts_mobile_idx" ON "vendor_contacts"("mobile");

-- CreateIndex
CREATE INDEX "vendor_contacts_isPrimary_idx" ON "vendor_contacts"("isPrimary");

-- CreateIndex
CREATE INDEX "vendor_contacts_isActive_idx" ON "vendor_contacts"("isActive");

-- CreateIndex
CREATE INDEX "vendor_contacts_deletedAt_idx" ON "vendor_contacts"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_addresses_uuid_key" ON "vendor_addresses"("uuid");

-- CreateIndex
CREATE INDEX "vendor_addresses_vendorId_idx" ON "vendor_addresses"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_addresses_type_idx" ON "vendor_addresses"("type");

-- CreateIndex
CREATE INDEX "vendor_addresses_stateId_idx" ON "vendor_addresses"("stateId");

-- CreateIndex
CREATE INDEX "vendor_addresses_cityId_idx" ON "vendor_addresses"("cityId");

-- CreateIndex
CREATE INDEX "vendor_addresses_pincode_idx" ON "vendor_addresses"("pincode");

-- CreateIndex
CREATE INDEX "vendor_addresses_isPrimary_idx" ON "vendor_addresses"("isPrimary");

-- CreateIndex
CREATE INDEX "vendor_addresses_isActive_idx" ON "vendor_addresses"("isActive");

-- CreateIndex
CREATE INDEX "vendor_addresses_deletedAt_idx" ON "vendor_addresses"("deletedAt");

-- AddForeignKey
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_addresses" ADD CONSTRAINT "vendor_addresses_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_addresses" ADD CONSTRAINT "vendor_addresses_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_addresses" ADD CONSTRAINT "vendor_addresses_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
