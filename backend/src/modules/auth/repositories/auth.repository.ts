import { Injectable } from '@nestjs/common';

import {
  LoginStatus,
  OtpPurpose,
  OtpStatus,
  Prisma,
  RefreshTokenStatus,
  User,
} from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a non-deleted user
   * by email or mobile.
   */
  async findUserByIdentifier(identifiers: string[]): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        deletedAt: null,

        OR: identifiers.flatMap((identifier) => [
          {
            email: identifier,
          },
          {
            mobile: identifier,
          },
        ]),
      },
    });
  }

  /**
   * Create OTP.
   */
  async createOtp(data: Prisma.OtpCreateInput) {
    return this.prisma.otp.create({
      data,
    });
  }

  /**
   * Find latest pending OTP
   * for receiver and purpose.
   */
  async findLatestOtp(receiver: string, purpose: OtpPurpose) {
    return this.prisma.otp.findFirst({
      where: {
        receiver,
        purpose,
        status: OtpStatus.PENDING,
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update one OTP.
   */
  async updateOtp(id: bigint, data: Prisma.OtpUpdateInput) {
    return this.prisma.otp.update({
      where: {
        id,
      },

      data,
    });
  }

  /**
   * Expire all previous pending OTPs
   * for same receiver and purpose.
   */
  async expirePendingOtps(receiver: string, purpose: OtpPurpose) {
    return this.prisma.otp.updateMany({
      where: {
        receiver,
        purpose,
        status: OtpStatus.PENDING,
      },

      data: {
        status: OtpStatus.EXPIRED,
      },
    });
  }

  /**
   * Increment OTP attempt count.
   * Marks OTP failed when max
   * attempts are reached.
   */
  async incrementOtpAttempt(
    id: bigint,
    attemptCount: number,
    maxAttempts: number,
  ) {
    const nextAttemptCount = attemptCount + 1;

    return this.prisma.otp.update({
      where: {
        id,
      },

      data: {
        attemptCount: nextAttemptCount,

        ...(nextAttemptCount >= maxAttempts && {
          status: OtpStatus.FAILED,
        }),
      },
    });
  }

  /**
   * Create refresh token.
   */
  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  /**
   * Find active and non-expired
   * refresh token by hash.
   */
  async findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,

        status: RefreshTokenStatus.ACTIVE,

        expiresAt: {
          gt: new Date(),
        },
      },

      include: {
        user: true,
      },
    });
  }

  /**
   * Update one refresh token.
   */
  async updateRefreshToken(id: bigint, data: Prisma.RefreshTokenUpdateInput) {
    return this.prisma.refreshToken.update({
      where: {
        id,
      },

      data,
    });
  }

  /**
   * Revoke one refresh token.
   */
  async revokeRefreshToken(id: bigint) {
    return this.prisma.refreshToken.update({
      where: {
        id,
      },

      data: {
        status: RefreshTokenStatus.REVOKED,

        revokedAt: new Date(),
      },
    });
  }

  /**
   * Revoke all active refresh tokens
   * for one user.
   */
  async revokeAllRefreshTokens(userId: bigint) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,

        status: RefreshTokenStatus.ACTIVE,
      },

      data: {
        status: RefreshTokenStatus.REVOKED,

        revokedAt: new Date(),
      },
    });
  }

  /**
   * Mark expired active tokens
   * as expired.
   */
  async expireRefreshTokens(userId?: bigint) {
    return this.prisma.refreshToken.updateMany({
      where: {
        status: RefreshTokenStatus.ACTIVE,

        expiresAt: {
          lte: new Date(),
        },

        ...(userId !== undefined && {
          userId,
        }),
      },

      data: {
        status: RefreshTokenStatus.EXPIRED,
      },
    });
  }

  /**
   * Create login history.
   */
  async createLoginHistory(data: Prisma.LoginHistoryCreateInput) {
    return this.prisma.loginHistory.create({
      data,
    });
  }

  /**
   * Mark active login history
   * records as logged out.
   */
  async updateLoginHistory(userId: bigint) {
    return this.prisma.loginHistory.updateMany({
      where: {
        userId,

        status: LoginStatus.SUCCESS,

        logoutAt: null,
      },

      data: {
        status: LoginStatus.LOGOUT,

        logoutAt: new Date(),
      },
    });
  }
}
