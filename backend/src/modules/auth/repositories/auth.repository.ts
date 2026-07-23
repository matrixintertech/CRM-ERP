import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { OtpPurpose, RefreshTokenStatus, LoginStatus  } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Find user by email or mobile
   */
  async findUserByIdentifier(
    identifier: string,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            mobile: identifier,
          },
        ],
      },
    });
  }

  /**
   * Create OTP
   */
  async createOtp(
    data: Prisma.OtpCreateInput,
  ) {
    return this.prisma.otp.create({
      data,
    });
  }

  /**
   * Get latest OTP
   */
async findLatestOtp(
  receiver: string,
  purpose: OtpPurpose,
) {
 return this.prisma.otp.findFirst({
  where: {
    receiver,
    purpose,
  },
  include: {
    user: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});
}
  async updateOtp(
  id: bigint,
  data: Prisma.OtpUpdateInput,
) {
  return this.prisma.otp.update({
    where: {
      id,
    },
    data,
  });
}


async createRefreshToken(
  data: Prisma.RefreshTokenCreateInput,
) {
  return this.prisma.refreshToken.create({
    data,
  });
}


 async findRefreshTokenByHash(
  tokenHash: string,
) {
  return this.prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      status: 'ACTIVE',
    },
    include: {
      user: true,
    },
  });
}


async updateRefreshToken(
  id: bigint,
  data: Prisma.RefreshTokenUpdateInput,
) {
  return this.prisma.refreshToken.update({
    where: {
      id,
    },
    data,
  });
}


async revokeRefreshToken(
  id: bigint,
) {
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


async revokeAllRefreshTokens(
  userId: bigint,
) {
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


async createLoginHistory(
  data: Prisma.LoginHistoryCreateInput,
) {
  return this.prisma.loginHistory.create({
    data,
  });
}


async updateLoginHistory(
  userId: bigint,
) {
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