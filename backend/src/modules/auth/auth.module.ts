import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';

import { AuthService } from './services/auth.service';

import { AuthRepository } from './repositories/auth.repository';

import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
  PassportModule,

  JwtModule.register({
    secret: jwtConfig.accessSecret,
    signOptions: {
      expiresIn: jwtConfig.accessExpiresIn as any,
    },
  }),

  PrismaModule,
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