import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { PassportStrategy } from "@nestjs/passport";

import {
  ExtractJwt,
  Strategy,
} from "passport-jwt";

import {
  UserType,
} from "@prisma/client";

import { jwtConfig } from "src/config/jwt.config";

import { PrismaService } from "src/database/prisma.service";

import type {
  JwtPayload,
} from "../interfaces/jwt-payload.interface";

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

  async validate(
    payload: JwtPayload,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: BigInt(payload.sub),
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        "User not found.",
      );
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException(
        "User is inactive.",
      );
    }

    const companyUserTypes: UserType[] = [
      UserType.COMPANY_ADMIN,
      UserType.EMPLOYEE,
    ];

    const requiresCompany =
      companyUserTypes.includes(
        user.userType,
      );

    if (requiresCompany) {
      if (!user.companyId) {
        throw new UnauthorizedException(
          "Company context is missing.",
        );
      }

      const company =
        await this.prisma.company.findFirst({
          where: {
            id: user.companyId,
            deletedAt: null,
          },
        });

      if (!company) {
        throw new UnauthorizedException(
          "Company not found.",
        );
      }

      if (company.status !== "ACTIVE") {
        throw new UnauthorizedException(
          "Company is inactive.",
        );
      }

      const subscription =
        await this.prisma.companySubscription.findFirst({
          where: {
            companyId: company.id,
            status: "ACTIVE",
            isCurrent: true,
          },
        });

      if (!subscription) {
        throw new UnauthorizedException(
          "Company subscription is inactive.",
        );
      }
    }

    return user;
  }
}