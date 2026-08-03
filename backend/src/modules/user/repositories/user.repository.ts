import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  UserStatus,
  UserType,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly userInclude = {
    role: {
      select: {
        uuid: true,
        name: true,
        code: true,
        status: true,
      },
    },

    employee: {
      select: {
        uuid: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        displayName: true,
        email: true,
        mobile: true,
        avatarUrl: true,
      },
    },
  } satisfies Prisma.UserInclude;

  async create(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (
      tx ?? this.prisma
    ).user.create({
      data,

      include:
        this.userInclude,
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

      include:
        this.userInclude,
    });
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },

      include:
        this.userInclude,
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

  async findByEmployee(
    companyId: bigint,
    employeeId: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,
        employeeId,
        deletedAt: null,
      },

      include:
        this.userInclude,
    });
  }

  async findByEmployeeUuid(
    companyId: bigint,
    employeeUuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,
        deletedAt: null,

        employee: {
          uuid:
            employeeUuid,

          deletedAt:
            null,
        },
      },

      include:
        this.userInclude,
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

      include:
        this.userInclude,
    });
  }

  async softDelete(
    id: bigint,
  ) {
    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        status:
          UserStatus.INACTIVE,

        deletedAt:
          new Date(),
      },

      include:
        this.userInclude,
    });
  }

  async findCompanyAdmin(
    companyId: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,

        userType:
          UserType.COMPANY_ADMIN,

        deletedAt:
          null,
      },

      include:
        this.userInclude,
    });
  }
}