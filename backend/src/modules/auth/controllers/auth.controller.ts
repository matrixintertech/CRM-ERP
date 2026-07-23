import { Body, Controller, Post,  Get,
  UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';


import { AuthService } from '../services/auth.service';

import { SendOtpDto } from '../dto/send-otp.dto';
import {VerifyOtpDto} from '../dto/verify-otp.dto';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyResetOtpDto } from '../dto/verify-reset-otp.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('send-otp')
  sendOtp(
    @Body() dto: SendOtpDto,
  ) {
    return this.authService.sendOtp(dto);
  }


    @Post('verify-otp')
    verifyOtp(
    @Body() dto: VerifyOtpDto,
    ) {
    return this.authService.verifyOtp(dto);
    }


    @Get('profile')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    profile(
      @CurrentUser() user: any,
    ) {
      return this.authService.profile(user);
    }


    @Post('refresh')
    refresh(
      @Body()
      dto: RefreshTokenDto,
    ) {
      return this.authService.refresh(dto);
    }


    @Post('logout')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    logout(
      @Body() dto: LogoutDto,
      @CurrentUser() user: any,
    ) {
      return this.authService.logout(
        user,
        dto,
      );
    }

    @Post('logout-all')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    logoutAll(
      @CurrentUser() user: any,
    ) {
      return this.authService.logoutAll(
        user,
      );
    }

    @Post('forgot-password')
    forgotPassword(
      @Body()
      dto: ForgotPasswordDto,
    ) {
      return this.authService.forgotPassword(
        dto,
      );
    }


    @Post('verify-reset-otp')
    verifyResetOtp(
      @Body()
      dto: VerifyResetOtpDto,
    ) {
      return this.authService.verifyResetOtp(
        dto,
      );
    }




}