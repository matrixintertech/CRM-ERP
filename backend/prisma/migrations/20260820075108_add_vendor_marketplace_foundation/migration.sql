-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VendorMarketplaceStatus" AS ENUM ('PRIVATE', 'PENDING', 'PUBLISHED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VendorOnboardingSource" AS ENUM ('SELF_REGISTRATION', 'COMPANY_INVITE', 'PLATFORM_CREATED');

-- CreateEnum
CREATE TYPE "VendorUserRole" AS ENUM ('OWNER', 'ADMIN', 'SALES', 'ACCOUNTS', 'OPERATIONS', 'USER');

-- CreateEnum
CREATE TYPE "VendorServiceAreaType" AS ENUM ('NATIONAL', 'STATE', 'CITY', 'PINCODE', 'RADIUS');

-- CreateEnum
CREATE TYPE "CompanySupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "CompanySupplierSource" AS ENUM ('MANUAL', 'GLOBAL_VENDOR', 'COMPANY_INVITE');

-- CreateEnum
CREATE TYPE "VendorInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "vendor_profiles" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "legalName" VARCHAR(200) NOT NULL,
    "displayName" VARCHAR(200),
    "panNumber" VARCHAR(20),
    "primaryGstNumber" VARCHAR(30),
    "email" VARCHAR(150),
    "mobile" VARCHAR(20),
    "website" VARCHAR(255),
    "address" TEXT,
    "pincode" VARCHAR(10),
    "onboardingSource" "VendorOnboardingSource" NOT NULL,
    "status" "VendorStatus" NOT NULL DEFAULT 'PENDING',
    "marketplaceStatus" "VendorMarketplaceStatus" NOT NULL DEFAULT 'PRIVATE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_users" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "role" "VendorUserRole" NOT NULL DEFAULT 'USER',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_categories" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_category_assignments" (
    "id" BIGSERIAL NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "categoryId" BIGINT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_category_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_service_areas" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "type" "VendorServiceAreaType" NOT NULL,
    "stateId" BIGINT,
    "cityId" BIGINT,
    "pincode" VARCHAR(10),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "radiusKm" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_service_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_suppliers" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "vendorId" BIGINT,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "contactName" VARCHAR(150),
    "mobile" VARCHAR(20),
    "email" VARCHAR(150),
    "gstNumber" VARCHAR(30),
    "panNumber" VARCHAR(20),
    "stateId" BIGINT,
    "cityId" BIGINT,
    "address" TEXT,
    "pincode" VARCHAR(10),
    "paymentTermsDays" INTEGER,
    "creditLimit" DECIMAL(14,2),
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "source" "CompanySupplierSource" NOT NULL DEFAULT 'MANUAL',
    "status" "CompanySupplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "linkedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "company_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_invitations" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT NOT NULL,
    "companySupplierId" BIGINT NOT NULL,
    "invitedByUserId" BIGINT NOT NULL,
    "email" VARCHAR(150),
    "mobile" VARCHAR(20),
    "tokenHash" VARCHAR(255) NOT NULL,
    "status" "VendorInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "vendorId" BIGINT,
    "acceptedByUserId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_uuid_key" ON "vendor_profiles"("uuid");

-- CreateIndex
CREATE INDEX "vendor_profiles_legalName_idx" ON "vendor_profiles"("legalName");

-- CreateIndex
CREATE INDEX "vendor_profiles_panNumber_idx" ON "vendor_profiles"("panNumber");

-- CreateIndex
CREATE INDEX "vendor_profiles_primaryGstNumber_idx" ON "vendor_profiles"("primaryGstNumber");

-- CreateIndex
CREATE INDEX "vendor_profiles_email_idx" ON "vendor_profiles"("email");

-- CreateIndex
CREATE INDEX "vendor_profiles_mobile_idx" ON "vendor_profiles"("mobile");

-- CreateIndex
CREATE INDEX "vendor_profiles_status_idx" ON "vendor_profiles"("status");

-- CreateIndex
CREATE INDEX "vendor_profiles_marketplaceStatus_idx" ON "vendor_profiles"("marketplaceStatus");

-- CreateIndex
CREATE INDEX "vendor_profiles_isVerified_idx" ON "vendor_profiles"("isVerified");

-- CreateIndex
CREATE INDEX "vendor_profiles_deletedAt_idx" ON "vendor_profiles"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_users_uuid_key" ON "vendor_users"("uuid");

-- CreateIndex
CREATE INDEX "vendor_users_vendorId_idx" ON "vendor_users"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_users_userId_idx" ON "vendor_users"("userId");

-- CreateIndex
CREATE INDEX "vendor_users_role_idx" ON "vendor_users"("role");

-- CreateIndex
CREATE INDEX "vendor_users_isPrimary_idx" ON "vendor_users"("isPrimary");

-- CreateIndex
CREATE INDEX "vendor_users_isActive_idx" ON "vendor_users"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_users_vendorId_userId_key" ON "vendor_users"("vendorId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_categories_uuid_key" ON "vendor_categories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_categories_code_key" ON "vendor_categories"("code");

-- CreateIndex
CREATE INDEX "vendor_categories_name_idx" ON "vendor_categories"("name");

-- CreateIndex
CREATE INDEX "vendor_categories_status_idx" ON "vendor_categories"("status");

-- CreateIndex
CREATE INDEX "vendor_categories_sortOrder_idx" ON "vendor_categories"("sortOrder");

-- CreateIndex
CREATE INDEX "vendor_categories_deletedAt_idx" ON "vendor_categories"("deletedAt");

-- CreateIndex
CREATE INDEX "vendor_category_assignments_vendorId_idx" ON "vendor_category_assignments"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_category_assignments_categoryId_idx" ON "vendor_category_assignments"("categoryId");

-- CreateIndex
CREATE INDEX "vendor_category_assignments_isPrimary_idx" ON "vendor_category_assignments"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_category_assignments_vendorId_categoryId_key" ON "vendor_category_assignments"("vendorId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_service_areas_uuid_key" ON "vendor_service_areas"("uuid");

-- CreateIndex
CREATE INDEX "vendor_service_areas_vendorId_idx" ON "vendor_service_areas"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_service_areas_type_idx" ON "vendor_service_areas"("type");

-- CreateIndex
CREATE INDEX "vendor_service_areas_stateId_idx" ON "vendor_service_areas"("stateId");

-- CreateIndex
CREATE INDEX "vendor_service_areas_cityId_idx" ON "vendor_service_areas"("cityId");

-- CreateIndex
CREATE INDEX "vendor_service_areas_pincode_idx" ON "vendor_service_areas"("pincode");

-- CreateIndex
CREATE INDEX "vendor_service_areas_isActive_idx" ON "vendor_service_areas"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "company_suppliers_uuid_key" ON "company_suppliers"("uuid");

-- CreateIndex
CREATE INDEX "company_suppliers_companyId_idx" ON "company_suppliers"("companyId");

-- CreateIndex
CREATE INDEX "company_suppliers_vendorId_idx" ON "company_suppliers"("vendorId");

-- CreateIndex
CREATE INDEX "company_suppliers_name_idx" ON "company_suppliers"("name");

-- CreateIndex
CREATE INDEX "company_suppliers_gstNumber_idx" ON "company_suppliers"("gstNumber");

-- CreateIndex
CREATE INDEX "company_suppliers_email_idx" ON "company_suppliers"("email");

-- CreateIndex
CREATE INDEX "company_suppliers_stateId_idx" ON "company_suppliers"("stateId");

-- CreateIndex
CREATE INDEX "company_suppliers_cityId_idx" ON "company_suppliers"("cityId");

-- CreateIndex
CREATE INDEX "company_suppliers_source_idx" ON "company_suppliers"("source");

-- CreateIndex
CREATE INDEX "company_suppliers_status_idx" ON "company_suppliers"("status");

-- CreateIndex
CREATE INDEX "company_suppliers_isPreferred_idx" ON "company_suppliers"("isPreferred");

-- CreateIndex
CREATE INDEX "company_suppliers_deletedAt_idx" ON "company_suppliers"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "company_suppliers_companyId_code_key" ON "company_suppliers"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "company_suppliers_companyId_vendorId_key" ON "company_suppliers"("companyId", "vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_invitations_uuid_key" ON "vendor_invitations"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_invitations_tokenHash_key" ON "vendor_invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "vendor_invitations_companyId_idx" ON "vendor_invitations"("companyId");

-- CreateIndex
CREATE INDEX "vendor_invitations_companySupplierId_idx" ON "vendor_invitations"("companySupplierId");

-- CreateIndex
CREATE INDEX "vendor_invitations_invitedByUserId_idx" ON "vendor_invitations"("invitedByUserId");

-- CreateIndex
CREATE INDEX "vendor_invitations_vendorId_idx" ON "vendor_invitations"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_invitations_acceptedByUserId_idx" ON "vendor_invitations"("acceptedByUserId");

-- CreateIndex
CREATE INDEX "vendor_invitations_email_idx" ON "vendor_invitations"("email");

-- CreateIndex
CREATE INDEX "vendor_invitations_mobile_idx" ON "vendor_invitations"("mobile");

-- CreateIndex
CREATE INDEX "vendor_invitations_status_idx" ON "vendor_invitations"("status");

-- CreateIndex
CREATE INDEX "vendor_invitations_expiresAt_idx" ON "vendor_invitations"("expiresAt");

-- AddForeignKey
ALTER TABLE "vendor_users" ADD CONSTRAINT "vendor_users_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_users" ADD CONSTRAINT "vendor_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_category_assignments" ADD CONSTRAINT "vendor_category_assignments_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_category_assignments" ADD CONSTRAINT "vendor_category_assignments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "vendor_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_service_areas" ADD CONSTRAINT "vendor_service_areas_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_service_areas" ADD CONSTRAINT "vendor_service_areas_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_service_areas" ADD CONSTRAINT "vendor_service_areas_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_suppliers" ADD CONSTRAINT "company_suppliers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_suppliers" ADD CONSTRAINT "company_suppliers_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_suppliers" ADD CONSTRAINT "company_suppliers_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_suppliers" ADD CONSTRAINT "company_suppliers_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invitations" ADD CONSTRAINT "vendor_invitations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invitations" ADD CONSTRAINT "vendor_invitations_companySupplierId_fkey" FOREIGN KEY ("companySupplierId") REFERENCES "company_suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invitations" ADD CONSTRAINT "vendor_invitations_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invitations" ADD CONSTRAINT "vendor_invitations_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invitations" ADD CONSTRAINT "vendor_invitations_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
