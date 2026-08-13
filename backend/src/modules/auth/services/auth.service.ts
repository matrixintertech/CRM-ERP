import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  LoginMethod,
  LoginStatus,
  OtpChannel,
  OtpPurpose,
  OtpStatus,
  RefreshTokenStatus,
  UserStatus,
} from '@prisma/client';

import { JwtService } from '@nestjs/jwt';

import { jwtConfig } from 'src/config/jwt.config';

import { AuthRepository } from '../repositories/auth.repository';

import { SendOtpDto } from '../dto/send-otp.dto';

import { VerifyOtpDto } from '../dto/verify-otp.dto';

import { RefreshTokenDto } from '../dto/refresh-token.dto';

import { LogoutDto } from '../dto/logout.dto';

import { ForgotPasswordDto } from '../dto/forgot-password.dto';

import { VerifyResetOtpDto } from '../dto/verify-reset-otp.dto';

import type { JwtPayload } from '../interfaces/jwt-payload.interface';

import { OtpUtil } from '../utils/otp.util';

import { TokenUtil } from '../utils/token.util';

/*
 * Apne actual mail module path ke according
 * is import ko adjust karna.
 */
import { MailService } from '../../mail/services/mail.service';

import { Msg91WhatsAppService } from 'src/modules/mail/services/msg91-whatsapp.service';

import {
  EffectivePermissionService,
} from '../../authorization/services/effective-permission.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,

    private readonly jwtService: JwtService,

    private readonly mailService: MailService,

    private readonly msg91WhatsAppService: Msg91WhatsAppService,

     private readonly effectivePermissionService:
    EffectivePermissionService,
  ) {}

  private ensureUserCanLogin(user: { status: UserStatus }): void {
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Your account has been suspended.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Your account is not active.');
    }
  }

  private async validateOtp(
    receiver: string,
    enteredOtp: string,
    purpose: OtpPurpose,
  ) {
    const latestOtp = await this.authRepository.findLatestOtp(
      receiver,
      purpose,
    );

    if (!latestOtp) {
      throw new NotFoundException('OTP not found or already used.');
    }

    if (latestOtp.expiresAt <= new Date()) {
      await this.authRepository.updateOtp(latestOtp.id, {
        status: OtpStatus.EXPIRED,
      });

      throw new BadRequestException('OTP has expired.');
    }

    if (latestOtp.attemptCount >= latestOtp.maxAttempts) {
      await this.authRepository.updateOtp(latestOtp.id, {
        status: OtpStatus.FAILED,
      });

      throw new BadRequestException('Maximum OTP attempts exceeded.');
    }

    const matched = OtpUtil.compare(enteredOtp, latestOtp.otpHash);

    if (!matched) {
      const updatedOtp = await this.authRepository.incrementOtpAttempt(
        latestOtp.id,
        latestOtp.attemptCount,
        latestOtp.maxAttempts,
      );

      const remainingAttempts = Math.max(
        updatedOtp.maxAttempts - updatedOtp.attemptCount,
        0,
      );

      if (updatedOtp.status === OtpStatus.FAILED) {
        throw new BadRequestException('Maximum OTP attempts exceeded.');
      }

      throw new BadRequestException(
        `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    await this.authRepository.updateOtp(latestOtp.id, {
      status: OtpStatus.VERIFIED,

      verifiedAt: new Date(),
    });

    if (!latestOtp.user) {
      throw new NotFoundException('User not found.');
    }

    return {
      otp: latestOtp,

      user: latestOtp.user,
    };
  }

  private getLoginMethod(channel: OtpChannel): LoginMethod {
    return channel === OtpChannel.WHATSAPP
      ? LoginMethod.WHATSAPP_OTP
      : LoginMethod.EMAIL_OTP;
  }

  private getRefreshTokenExpiry(): Date {
    /*
     * Current config 30 days hai.
     * Baad me env duration parser use kar sakte ho.
     */
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  async sendOtp(dto: SendOtpDto) {
    const { lookupValues, receiver, channel } = this.normalizeLoginIdentifier(
      dto.identifier,
    );

    const user = await this.authRepository.findUserByIdentifier(lookupValues);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    this.ensureUserCanLogin(user);

    const latestOtp = await this.authRepository.findLatestOtp(
      receiver,
      OtpPurpose.LOGIN,
    );

    if (latestOtp && latestOtp.expiresAt > new Date()) {
      return {
        success: true,
        alreadySent: true,

        channel,

        message:
          channel === OtpChannel.EMAIL
            ? 'OTP already sent. Please check your email.'
            : 'OTP already sent. Please check WhatsApp.',
      };
    }

    /*
     * Pending but expired OTP records ko
     * expire karke fresh OTP create karo.
     */
    await this.authRepository.expirePendingOtps(receiver, OtpPurpose.LOGIN);

    const otp = OtpUtil.generate();

    const otpHash = OtpUtil.hash(otp);

    const expiresAt = OtpUtil.expiry();

    await this.authRepository.createOtp({
      user: {
        connect: {
          id: user.id,
        },
      },

      receiver,

      otpHash,

      purpose: OtpPurpose.LOGIN,

      channel,

      expiresAt,
    });

    if (channel === OtpChannel.EMAIL) {
      await this.mailService.sendLoginOtp({
        to: receiver,

        displayName: user.displayName ?? 'User',

        otp,

        expiresInMinutes: 5,
      });
    } else {
      await this.msg91WhatsAppService.sendLoginOtp(receiver, otp);
    }

    return {
      success: true,
      alreadySent: false,
      channel,

      message:
        channel === OtpChannel.EMAIL
          ? 'OTP sent to your email.'
          : 'OTP sent on WhatsApp.',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { receiver } = this.normalizeLoginIdentifier(dto.identifier);

    const { otp, user } = await this.validateOtp(
      receiver,
      dto.otp,
      OtpPurpose.LOGIN,
    );

    this.ensureUserCanLogin(user);

    const payload: JwtPayload = {
      sub: user.id.toString(),

      companyId: user.companyId ? user.companyId.toString() : undefined,

      userType: user.userType,
    };

    const accessToken = await this.generateAccessToken(payload);

    const refreshToken = await this.generateRefreshToken(payload);

    const refreshTokenHash = TokenUtil.hash(refreshToken);

    await this.authRepository.createRefreshToken({
      user: {
        connect: {
          id: user.id,
        },
      },

      tokenHash: refreshTokenHash,

      expiresAt: this.getRefreshTokenExpiry(),
    });

    await this.authRepository.createLoginHistory({
      user: {
        connect: {
          id: user.id,
        },
      },

      receiver,

      loginMethod: this.getLoginMethod(otp.channel),

      status: LoginStatus.SUCCESS,

      loginAt: new Date(),
    });

    return {
      message: 'Login successful.',

      accessToken,

      refreshToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const receiver = dto.receiver.trim().toLowerCase();

    const user = await this.authRepository.findUserByIdentifier([receiver]);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    this.ensureUserCanLogin(user);

    const latestOtp = await this.authRepository.findLatestOtp(
      receiver,
      OtpPurpose.RESET_PASSWORD,
    );

    if (latestOtp && latestOtp.expiresAt > new Date()) {
      throw new ConflictException(
        'OTP already sent. Please wait before requesting a new OTP.',
      );
    }

    await this.authRepository.expirePendingOtps(
      receiver,
      OtpPurpose.RESET_PASSWORD,
    );

    const otp = OtpUtil.generate();

    const otpHash = OtpUtil.hash(otp);

    const expiresAt = OtpUtil.expiry();

    await this.authRepository.createOtp({
      user: {
        connect: {
          id: user.id,
        },
      },

      receiver,

      otpHash,

      purpose: OtpPurpose.RESET_PASSWORD,

      channel: dto.channel,

      expiresAt,
    });

    if (dto.channel === OtpChannel.EMAIL) {
      await this.mailService.sendResetPasswordOtp({
        to: receiver,

        displayName: user.displayName ?? 'User',

        otp,

        expiresInMinutes: 5,
      });
    } else {
      throw new BadRequestException('WhatsApp OTP is not configured.');
    }

    return {
      message: 'Password reset OTP sent successfully.',
    };
  }

  async verifyResetOtp(dto: VerifyResetOtpDto) {
    const receiver = dto.receiver.trim().toLowerCase();

    const { user } = await this.validateOtp(
      receiver,
      dto.otp,
      OtpPurpose.RESET_PASSWORD,
    );

    this.ensureUserCanLogin(user);

    const resetToken = await this.jwtService.signAsync(
      {
        sub: user.id.toString(),

        purpose: OtpPurpose.RESET_PASSWORD,
      },
      {
        secret: jwtConfig.accessSecret,

        expiresIn: '10m',
      },
    );

    return {
      message: 'OTP verified successfully.',

      resetToken,
    };
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConfig.accessSecret,

      expiresIn: jwtConfig.accessExpiresIn as any,
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConfig.refreshSecret,

      expiresIn: jwtConfig.refreshExpiresIn as any,
    });
  }

 async profile(user: any) {
  /*
   * Existing centralized authorization
   * engine se fresh effective grants lo.
   *
   * Company user:
   * RolePermission + UserPermission
   *
   * Platform owner:
   * PlatformRolePermission
   */
  const authorization =
    await this.effectivePermissionService
      .getAuthorization(
        user.id,
      );


  /*
   * Frontend ko internal database IDs
   * ki zarurat nahi hai.
   *
   * UI capability checks ke liye
   * lightweight permission snapshot.
   */
  const effectivePermissions = [
    ...authorization
      .companyPermissions
      .map(
        (permission) => ({
          code:
            permission.code,

          type:
            permission.type,

          scope:
            permission.scope,

          source:
            permission.source,
        }),
      ),

    ...authorization
      .platformPermissions
      .map(
        (permission) => ({
          code:
            permission.code,

          type:
            permission.type,

          scope:
            null,

          source:
            permission.source,
        }),
      ),
  ];


  return {
    id:
      user.id.toString(),

    uuid:
      user.uuid,

    email:
      user.email,

    mobile:
      user.mobile,

    companyId:
      user.companyId
        ? user.companyId.toString()
        : null,

    employeeId:
      user.employeeId
        ? user.employeeId.toString()
        : null,

    roleId:
      user.roleId
        ? user.roleId.toString()
        : null,

    userType:
      user.userType,

    displayName:
      user.displayName,

    profilePhoto:
      user.profilePhoto,

    status:
      user.status,

    effectivePermissions,
  };
}

  async refresh(dto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        {
          secret: jwtConfig.refreshSecret,
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const tokenHash = TokenUtil.hash(dto.refreshToken);

    const storedToken =
      await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (!storedToken.user) {
      throw new UnauthorizedException('User not found.');
    }

    const user = storedToken.user;

    this.ensureUserCanLogin(user);

    if (payload.sub !== user.id.toString()) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    /*
     * Refresh-token rotation:
     * old token revoke karke new token create.
     */
    await this.authRepository.updateRefreshToken(storedToken.id, {
      status: RefreshTokenStatus.REVOKED,

      revokedAt: new Date(),

      lastUsedAt: new Date(),
    });

    const newPayload: JwtPayload = {
      sub: user.id.toString(),

      companyId: user.companyId ? user.companyId.toString() : undefined,

      userType: user.userType,
    };

    const accessToken = await this.generateAccessToken(newPayload);

    const newRefreshToken = await this.generateRefreshToken(newPayload);

    const newRefreshTokenHash = TokenUtil.hash(newRefreshToken);

    await this.authRepository.createRefreshToken({
      user: {
        connect: {
          id: user.id,
        },
      },

      tokenHash: newRefreshTokenHash,

      expiresAt: this.getRefreshTokenExpiry(),
    });

    return {
      message: 'Token refreshed successfully.',

      accessToken,

      refreshToken: newRefreshToken,
    };
  }

  async logout(user: any, dto: LogoutDto) {
    const tokenHash = TokenUtil.hash(dto.refreshToken);

    const storedToken =
      await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    if (storedToken.userId !== user.id) {
      throw new UnauthorizedException('Invalid token.');
    }

    await this.authRepository.revokeRefreshToken(storedToken.id);

    await this.authRepository.updateLoginHistory(user.id);

    return {
      message: 'Logout successful.',
    };
  }

  async logoutAll(user: any) {
    await this.authRepository.revokeAllRefreshTokens(user.id);

    await this.authRepository.updateLoginHistory(user.id);

    return {
      message: 'Logged out from all devices successfully.',
    };
  }

  private normalizeLoginIdentifier(rawValue: string): {
    lookupValues: string[];
    receiver: string;
    channel: OtpChannel;
  } {
    const value = rawValue.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(value)) {
      const email = value.toLowerCase();

      return {
        lookupValues: [email],
        receiver: email,
        channel: OtpChannel.EMAIL,
      };
    }

    const digits = value.replace(/\D/g, '');

    if (digits.length === 10) {
      return {
        // Database me dono format search honge
        lookupValues: [digits, `91${digits}`],

        // OTP WhatsApp hamesha country code ke sath jayega
        receiver: `91${digits}`,

        channel: OtpChannel.WHATSAPP,
      };
    }

    if (digits.length === 12 && digits.startsWith('91')) {
      return {
        lookupValues: [digits, digits.slice(2)],

        receiver: digits,

        channel: OtpChannel.WHATSAPP,
      };
    }

    throw new BadRequestException(
      'Enter a valid email address or mobile number.',
    );
  }
}
