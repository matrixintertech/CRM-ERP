import { Injectable } from '@nestjs/common';

import {
  Prisma,
  UserStatus,
  UserType,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';


@Injectable()
export class PlatformUserRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}


  private readonly select = {
    id: true,
    uuid: true,

    displayName: true,
    email: true,
    mobile: true,
    profilePhoto: true,

    userType: true,
    status: true,

    platformRoleId: true,

    platformRole: {
      select: {
        id: true,
        uuid: true,
        name: true,
        code: true,
        description: true,
        isSystem: true,
        status: true,
      },
    },

    emailVerified: true,
    mobileVerified: true,

    lastLoginAt: true,
    lastActiveAt: true,

    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.UserSelect;


  async create(
    data: Prisma.UserCreateInput,
  ) {
    return this.prisma.user.create({
      data,

      select: this.select,
    });
  }


  async findAll() {
    return this.prisma.user.findMany({
      where: {
        userType:
          UserType.PLATFORM_OWNER,

        companyId: null,
        employeeId: null,

        deletedAt: null,
      },

      select: this.select,

      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  async findByUuid(
    uuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        uuid,

        userType:
          UserType.PLATFORM_OWNER,

        companyId: null,
        employeeId: null,

        deletedAt: null,
      },

      select: this.select,
    });
  }


  async findByEmail(
    email: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },

      select: {
        id: true,
        uuid: true,
        deletedAt: true,
      },
    });
  }


  async findByMobile(
    mobile: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        mobile,
      },

      select: {
        id: true,
        uuid: true,
        deletedAt: true,
      },
    });
  }


  async update(
    uuid: string,
    data: Prisma.UserUpdateInput,
  ) {
    return this.prisma.user.update({
      where: {
        uuid,
      },

      data,

      select: this.select,
    });
  }


  async softDelete(
    uuid: string,
  ) {
    return this.prisma.user.update({
      where: {
        uuid,
      },

      data: {
        status:
          UserStatus.INACTIVE,

        deletedAt:
          new Date(),
      },

      select: this.select,
    });
  }
}