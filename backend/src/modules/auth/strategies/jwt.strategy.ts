import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { jwtConfig } from 'src/config/jwt.config';

import { PrismaService } from 'src/database/prisma.service';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly prisma: PrismaService,
  ) {
   
    super({
      jwtFromRequest:
      
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        jwtConfig.accessSecret,
    });

     console.log('JWT Secret:', jwtConfig.accessSecret);
  }

async validate(
  payload: JwtPayload,
) {
  console.log('Payload:', payload);
  const user = await this.prisma.user.findUnique({
    where: {
      id: BigInt(payload.sub),
    },
  });

    console.log('User:', user);

  if (!user) {
    throw new UnauthorizedException(
      'User not found.',
    );
  }

  // User Active?
  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedException(
      'User is inactive.',
    );
  }

  // Company Admin Validation
  if (user.userType === 'COMPANY_ADMIN') {
    // Company Exists?
    const company =
      await this.prisma.company.findUnique({
        where: {
          id: user.companyId!,
        },
      });

    if (!company) {
      throw new UnauthorizedException(
        'Company not found.',
      );
    }

    if (company.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        'Company is inactive.',
      );
    }

    // Active Subscription?
    const subscription =
      await this.prisma.companySubscription.findFirst({
        where: {
          companyId: company.id,
          status: 'ACTIVE',
        },
      });

    if (!subscription) {
      throw new UnauthorizedException(
        'Company subscription is inactive.',
      );
    }
  }

  return user;
}



}