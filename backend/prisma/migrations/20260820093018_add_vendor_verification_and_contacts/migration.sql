-- CreateEnum
CREATE TYPE "VendorVerificationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VendorDocumentType" AS ENUM ('PAN', 'GST_CERTIFICATE', 'UDYAM', 'BUSINESS_REGISTRATION', 'ADDRESS_PROOF', 'BANK_PROOF', 'CANCELLED_CHEQUE', 'OTHER');

-- CreateEnum
CREATE TYPE "VendorDocumentVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VendorBankAccountStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "VendorTaxRegistrationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'INACTIVE');

-- CreateTable
CREATE TABLE "vendor_verifications" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "status" "VendorVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedByUserId" BIGINT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_documents" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "type" "VendorDocumentType" NOT NULL,
    "documentNumber" VARCHAR(100),
    "storageKey" VARCHAR(500) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(100),
    "sizeBytes" BIGINT,
    "status" "VendorDocumentVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedByUserId" BIGINT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_tax_registrations" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "gstNumber" VARCHAR(30) NOT NULL,
    "legalName" VARCHAR(200),
    "tradeName" VARCHAR(200),
    "stateId" BIGINT,
    "address" TEXT,
    "pincode" VARCHAR(10),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "VendorTaxRegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_tax_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_bank_accounts" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "vendorId" BIGINT NOT NULL,
    "accountHolderName" VARCHAR(200) NOT NULL,
    "bankName" VARCHAR(150) NOT NULL,
    "branchName" VARCHAR(150),
    "accountNumberEncrypted" TEXT NOT NULL,
    "accountNumberLast4" VARCHAR(4) NOT NULL,
    "ifscCode" VARCHAR(20) NOT NULL,
    "accountType" VARCHAR(30),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "VendorBankAccountStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_verifications_uuid_key" ON "vendor_verifications"("uuid");

-- CreateIndex
CREATE INDEX "vendor_verifications_vendorId_idx" ON "vendor_verifications"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_verifications_status_idx" ON "vendor_verifications"("status");

-- CreateIndex
CREATE INDEX "vendor_verifications_reviewedByUserId_idx" ON "vendor_verifications"("reviewedByUserId");

-- CreateIndex
CREATE INDEX "vendor_verifications_isCurrent_idx" ON "vendor_verifications"("isCurrent");

-- CreateIndex
CREATE INDEX "vendor_verifications_submittedAt_idx" ON "vendor_verifications"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_documents_uuid_key" ON "vendor_documents"("uuid");

-- CreateIndex
CREATE INDEX "vendor_documents_vendorId_idx" ON "vendor_documents"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_documents_type_idx" ON "vendor_documents"("type");

-- CreateIndex
CREATE INDEX "vendor_documents_status_idx" ON "vendor_documents"("status");

-- CreateIndex
CREATE INDEX "vendor_documents_reviewedByUserId_idx" ON "vendor_documents"("reviewedByUserId");

-- CreateIndex
CREATE INDEX "vendor_documents_expiresAt_idx" ON "vendor_documents"("expiresAt");

-- CreateIndex
CREATE INDEX "vendor_documents_deletedAt_idx" ON "vendor_documents"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_tax_registrations_uuid_key" ON "vendor_tax_registrations"("uuid");

-- CreateIndex
CREATE INDEX "vendor_tax_registrations_vendorId_idx" ON "vendor_tax_registrations"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_tax_registrations_gstNumber_idx" ON "vendor_tax_registrations"("gstNumber");

-- CreateIndex
CREATE INDEX "vendor_tax_registrations_stateId_idx" ON "vendor_tax_registrations"("stateId");

-- CreateIndex
CREATE INDEX "vendor_tax_registrations_isPrimary_idx" ON "vendor_tax_registrations"("isPrimary");

-- CreateIndex
CREATE INDEX "vendor_tax_registrations_status_idx" ON "vendor_tax_registrations"("status");

-- CreateIndex
CREATE INDEX "vendor_tax_registrations_deletedAt_idx" ON "vendor_tax_registrations"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_tax_registrations_vendorId_gstNumber_key" ON "vendor_tax_registrations"("vendorId", "gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_bank_accounts_uuid_key" ON "vendor_bank_accounts"("uuid");

-- CreateIndex
CREATE INDEX "vendor_bank_accounts_vendorId_idx" ON "vendor_bank_accounts"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_bank_accounts_ifscCode_idx" ON "vendor_bank_accounts"("ifscCode");

-- CreateIndex
CREATE INDEX "vendor_bank_accounts_isPrimary_idx" ON "vendor_bank_accounts"("isPrimary");

-- CreateIndex
CREATE INDEX "vendor_bank_accounts_status_idx" ON "vendor_bank_accounts"("status");

-- CreateIndex
CREATE INDEX "vendor_bank_accounts_deletedAt_idx" ON "vendor_bank_accounts"("deletedAt");

-- AddForeignKey
ALTER TABLE "vendor_verifications" ADD CONSTRAINT "vendor_verifications_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_verifications" ADD CONSTRAINT "vendor_verifications_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_documents" ADD CONSTRAINT "vendor_documents_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_documents" ADD CONSTRAINT "vendor_documents_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_tax_registrations" ADD CONSTRAINT "vendor_tax_registrations_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_tax_registrations" ADD CONSTRAINT "vendor_tax_registrations_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_bank_accounts" ADD CONSTRAINT "vendor_bank_accounts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
