import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from 'src/database/prisma.module';
import { jwtConfig } from 'src/config/jwt.config';

import { MailModule } from '../mail/mail.module';

import {
  AuthorizationModule,
} from '../authorization/authorization.module';

import { AuthController } from './controllers/auth.controller';

import { AuthService } from './services/auth.service';

import { AuthRepository } from './repositories/auth.repository';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,

    JwtModule.register({
      secret: jwtConfig.accessSecret,

      signOptions: {
        expiresIn:
          jwtConfig.accessExpiresIn as any,
      },
    }),

    PrismaModule,

    MailModule,

    AuthorizationModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
  ],

  exports: [
    AuthService,
  ],
})
export class AuthModule {}