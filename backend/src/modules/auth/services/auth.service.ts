import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  OtpPurpose,
  OtpStatus,RefreshTokenStatus, LoginMethod, LoginStatus
} from '@prisma/client';

import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';

import { AuthRepository } from '../repositories/auth.repository';

import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { OtpUtil } from '../utils/otp.util';
import { TokenUtil } from '../utils/token.util';
import { LogoutDto } from '../dto/logout.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyResetOtpDto } from '../dto/verify-reset-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
     private readonly jwtService: JwtService,
  ) {}

   async sendOtp(dto: SendOtpDto) {
  const user =
    await this.authRepository.findUserByIdentifier(
      dto.receiver,
    );

  if (!user) {
    throw new NotFoundException(
      'User not found.',
    );
  }

const latestOtp =
  await this.authRepository.findLatestOtp(
    dto.receiver,
    OtpPurpose.LOGIN,
  );

  if (
    latestOtp &&
    latestOtp.status === OtpStatus.PENDING &&
    latestOtp.expiresAt > new Date()
  ) {
    throw new ConflictException(
      'OTP already sent. Please wait before requesting a new OTP.',
    );
  }

  const otp = OtpUtil.generate();

  console.log('Generated OTP:', otp);

  const otpHash = OtpUtil.hash(otp);

  const expiresAt = OtpUtil.expiry();

  await this.authRepository.createOtp({
    user: {
      connect: {
        id: user.id,
      },
    },
    receiver: dto.receiver,
    otpHash,
    purpose: OtpPurpose.LOGIN,
    channel: dto.channel,
    expiresAt,
  });

  //console.log('OTP:', otp);

  return {
    message: 'OTP sent successfully.',
  };
}


//forget password OTP
async forgotPassword(
  dto: ForgotPasswordDto,
) {
  // 1. Find user
  const user =
    await this.authRepository.findUserByIdentifier(
      dto.receiver,
    );

  if (!user) {
    throw new NotFoundException(
      'User not found.',
    );
  }

  // 2. Check existing RESET_PASSWORD OTP
  const latestOtp =
    await this.authRepository.findLatestOtp(
      dto.receiver,
      OtpPurpose.RESET_PASSWORD,
    );

  if (
    latestOtp &&
    latestOtp.status === OtpStatus.PENDING &&
    latestOtp.expiresAt > new Date()
  ) {
    throw new ConflictException(
      'OTP already sent. Please wait before requesting a new OTP.',
    );
  }

  // 3. Generate OTP
  const otp = OtpUtil.generate();

  console.log(
    'Reset OTP:',
    otp,
  );

  // 4. Hash OTP
  const otpHash =
    OtpUtil.hash(otp);

  // 5. Expiry
  const expiresAt =
    OtpUtil.expiry();

  // 6. Save OTP
  await this.authRepository.createOtp({
    user: {
      connect: {
        id: user.id,
      },
    },

    receiver: dto.receiver,

    otpHash,

    purpose:
      OtpPurpose.RESET_PASSWORD,

    channel: dto.channel,

    expiresAt,
  });

  return {
    message:
      'Password reset OTP sent successfully.',
  };
}


//Reset OTP
async verifyResetOtp(
  dto: VerifyResetOtpDto,
) {
  // 1. Find latest OTP
  const latestOtp =
    await this.authRepository.findLatestOtp(
      dto.receiver,
      OtpPurpose.RESET_PASSWORD,
    );

  if (!latestOtp) {
    throw new NotFoundException(
      'OTP not found.',
    );
  }

  // 2. Check status
  if (
    latestOtp.status !== OtpStatus.PENDING
  ) {
    throw new BadRequestException(
      'OTP already used.',
    );
  }

  // 3. Check expiry
  if (
    latestOtp.expiresAt <
    new Date()
  ) {
    throw new BadRequestException(
      'OTP has expired.',
    );
  }

  // 4. Verify OTP
  const matched = OtpUtil.compare(
    dto.otp,
    latestOtp.otpHash,
  );

  if (!matched) {
    throw new BadRequestException(
      'Invalid OTP.',
    );
  }

  // 5. Mark OTP verified
  await this.authRepository.updateOtp(
    latestOtp.id,
    {
      status: OtpStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  );

  // 6. User exists?
  if (!latestOtp.user) {
    throw new NotFoundException(
      'User not found.',
    );
  }

  const user = latestOtp.user;

  // 7. Generate reset token
  const resetToken =
    await this.jwtService.signAsync(
      {
        sub: user.id.toString(),
      },
      {
        secret:
          jwtConfig.accessSecret,
        expiresIn: '10m',
      },
    );

  return {
    message:
      'OTP verified successfully.',
    resetToken,
  };
}




 async verifyOtp(dto: VerifyOtpDto) {
  // 1. Find latest OTP
const latestOtp =
  await this.authRepository.findLatestOtp(
    dto.receiver,
    OtpPurpose.LOGIN,
  );

  if (!latestOtp) {
    throw new NotFoundException(
      'OTP not found.',
    );
  }

  // 2. Check OTP Status
  if (latestOtp.status !== OtpStatus.PENDING) {
    throw new BadRequestException(
      'OTP already used.',
    );
  }

  // 3. Check Expiry
  if (latestOtp.expiresAt < new Date()) {
    throw new BadRequestException(
      'OTP has expired.',
    );
  }

  // 4. Compare OTP
  const matched = OtpUtil.compare(
    dto.otp,
    latestOtp.otpHash,
  );

  if (!matched) {
    throw new BadRequestException(
      'Invalid OTP.',
    );
  }

  await this.authRepository.updateOtp(
  latestOtp.id,
  {
    status: OtpStatus.VERIFIED,
    verifiedAt: new Date(),
  },
);


if (!latestOtp.user) {
  throw new NotFoundException('User not found.');
}


const user = latestOtp.user;


const payload: JwtPayload = {
  sub: user.id.toString(),
  companyId: user.companyId
    ? user.companyId.toString()
    : undefined,
};

const accessToken =
  await this.generateAccessToken(payload);

const refreshToken =
  await this.generateRefreshToken(payload);

  const refreshTokenHash =
  TokenUtil.hash(refreshToken);

  await this.authRepository.createRefreshToken({
  user: {
    connect: {
      id: user.id,
    },
  },

  tokenHash: refreshTokenHash,

  expiresAt: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ),
});


await this.authRepository.createLoginHistory({
  user: {
    connect: {
      id: user.id,
    },
  },

  receiver: dto.receiver,

 loginMethod: LoginMethod.EMAIL_OTP,

  status: LoginStatus.SUCCESS,

  loginAt: new Date(),
});

return {
  message: 'Login successful.',
  accessToken,
  refreshToken,
};
}



 private async generateAccessToken(
    payload: JwtPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConfig.accessSecret,
      expiresIn: jwtConfig.accessExpiresIn as any,
    });
  }

  private async generateRefreshToken(
    payload: JwtPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshExpiresIn as any,
    });
  }


   async profile(user: any) {
  return {
    id: user.id.toString(),
    uuid: user.uuid,
    email: user.email,
    companyId: user.companyId
      ? user.companyId.toString()
      : null,
    displayName: user.displayName,
    status: user.status,
  };
}

// REFRESH TOKEN FUNCTION
 async refresh(
  dto: RefreshTokenDto,
) {


  let payload: JwtPayload;

try {
  payload =
    await this.jwtService.verifyAsync(
      dto.refreshToken,
      {
        secret: jwtConfig.refreshSecret,
      },
    );
    console.log('A');
} catch {
  throw new UnauthorizedException(
    'Invalid refresh token.',
  );
}

  // 1. Hash incoming refresh token
  const tokenHash = TokenUtil.hash(
    dto.refreshToken,
  );

  // 2. Find refresh token
  const storedToken =
    await this.authRepository.findRefreshTokenByHash(
      tokenHash,
    );
    console.log('B');

  if (!storedToken) {
    throw new UnauthorizedException(
      'Invalid refresh token.',
    );
  }

  // 3. Check expiry
  if (
    storedToken.expiresAt <
    new Date()
  ) {
    throw new UnauthorizedException(
      'Refresh token expired.',
    );
  }

  // 4. User exists?
  if (!storedToken.user) {
    throw new UnauthorizedException(
      'User not found.',
    );
  }

  const user = storedToken.user;


  // 7. Update last used
await this.authRepository.updateRefreshToken(
  storedToken.id,
  {
    status: RefreshTokenStatus.REVOKED,
    revokedAt: new Date(),
    lastUsedAt: new Date(),
  },
);

console.log('C');

const newPayload: JwtPayload = {
  sub: user.id.toString(),
  companyId: user.companyId
    ? user.companyId.toString()
    : undefined,
};

const accessToken =
  await this.generateAccessToken(
    newPayload,
  );

  console.log('D');

const newRefreshToken =
  await this.generateRefreshToken(
    newPayload,
  );

  console.log('E');

const newRefreshTokenHash =
  TokenUtil.hash(
    newRefreshToken,
  );

  console.log('F');

try {
  await this.authRepository.createRefreshToken({
    user: {
      connect: {
        id: user.id,
      },
    },
    tokenHash: newRefreshTokenHash,
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ),
  });
  



  console.log('Refresh token saved');
} catch (error) {
  console.error('Create Refresh Token Error:', error);
  throw error;
}

  // 8. Return
  return {
  message: 'Token refreshed successfully.',
  accessToken,
  refreshToken: newRefreshToken,
  };
}


async logout(
  user: any,
  dto: LogoutDto,
) {
  // 1. Hash refresh token
  const tokenHash = TokenUtil.hash(
    dto.refreshToken,
  );

  // 2. Find token
  const storedToken =
    await this.authRepository.findRefreshTokenByHash(
      tokenHash,
    );

  if (!storedToken) {
    throw new UnauthorizedException(
      'Invalid refresh token.',
    );
  }

  // 3. Ensure token belongs to logged-in user
  if (storedToken.userId !== user.id) {
    throw new UnauthorizedException(
      'Invalid token.',
    );
  }

  // 4. Revoke token
  await this.authRepository.revokeRefreshToken(
    storedToken.id,
  );



  await this.authRepository.updateLoginHistory(
  user.id,
);

  return {
    message: 'Logout successful.',
  };
}


async logoutAll(
  user: any,
) {
  await this.authRepository.revokeAllRefreshTokens(
    user.id,
  );

  await this.authRepository.updateLoginHistory(
  user.id,
);

  return {
    message:
      'Logged out from all devices successfully.',
  };
}
}