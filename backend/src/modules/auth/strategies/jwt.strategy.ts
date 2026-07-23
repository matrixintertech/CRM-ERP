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
  }

   async validate(payload: JwtPayload) {
  console.log('JWT Payload:', payload);

  const user = await this.prisma.user.findUnique({
    where: {
      id: BigInt(payload.sub),
    },
  });

  console.log('User:', user);

  if (!user) {
    throw new UnauthorizedException('User not found.');
  }

  return user;
}
}