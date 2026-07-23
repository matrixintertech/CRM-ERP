-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('LOGIN', 'VERIFY_EMAIL', 'VERIFY_MOBILE', 'RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "OtpChannel" AS ENUM ('EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "OtpStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "RefreshTokenStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('SUCCESS', 'FAILED', 'LOGOUT');

-- CreateEnum
CREATE TYPE "LoginMethod" AS ENUM ('EMAIL_OTP', 'WHATSAPP_OTP');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "companyId" BIGINT,
    "email" TEXT,
    "mobile" TEXT,
    "passwordHash" TEXT,
    "displayName" TEXT,
    "profilePhoto" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "lastLoginAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "userId" BIGINT,
    "receiver" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "channel" "OtpChannel" NOT NULL,
    "status" "OtpStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "userId" BIGINT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" "RefreshTokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "userId" BIGINT,
    "loginMethod" "LoginMethod" NOT NULL,
    "status" "LoginStatus" NOT NULL,
    "receiver" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "loginAt" TIMESTAMP(3),
    "logoutAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "users"("companyId");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "otps_uuid_key" ON "otps"("uuid");

-- CreateIndex
CREATE INDEX "otps_userId_idx" ON "otps"("userId");

-- CreateIndex
CREATE INDEX "otps_receiver_idx" ON "otps"("receiver");

-- CreateIndex
CREATE INDEX "otps_purpose_idx" ON "otps"("purpose");

-- CreateIndex
CREATE INDEX "otps_status_idx" ON "otps"("status");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_uuid_key" ON "refresh_tokens"("uuid");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_status_idx" ON "refresh_tokens"("status");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "login_history_uuid_key" ON "login_history"("uuid");

-- CreateIndex
CREATE INDEX "login_history_userId_idx" ON "login_history"("userId");

-- CreateIndex
CREATE INDEX "login_history_receiver_idx" ON "login_history"("receiver");

-- CreateIndex
CREATE INDEX "login_history_status_idx" ON "login_history"("status");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
