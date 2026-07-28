import { Injectable } from '@nestjs/common';

import {
  Prisma,
  User,
   UserType,
} from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

async create(
  data: Prisma.UserCreateInput,
  tx?: Prisma.TransactionClient,
): Promise<User> {
  return (tx ?? this.prisma).user.create({
    data,
  });
}
  async findById(
    id: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByEmail(
    email: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async findByMobile(
    mobile: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        mobile,
        deletedAt: null,
      },
    });
  }

  async update(
    id: bigint,
    data: Prisma.UserUpdateInput,
  ) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }


async findCompanyAdmin(
  companyId: bigint,
) {
  return this.prisma.user.findFirst({
    where: {
      companyId,
      userType: UserType.COMPANY_ADMIN,
      deletedAt: null,
    },
  });
}



}