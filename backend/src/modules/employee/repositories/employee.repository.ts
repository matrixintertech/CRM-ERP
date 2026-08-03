import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  Status,
} from "@prisma/client";

import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class EmployeeRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly employeeInclude = {
    company: true,

    organizationUnit: true,

    department: true,

    designation: true,

    manager: {
      select: {
        uuid: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        displayName: true,
      },
    },

    user: {
      select: {
        uuid: true,
        email: true,
        mobile: true,
        displayName: true,
        userType: true,
        status: true,

        role: {
          select: {
            uuid: true,
            name: true,
            code: true,
            status: true,
          },
        },
      },
    },
  } satisfies Prisma.EmployeeInclude;

  async create(
    data: Prisma.EmployeeCreateInput,
  ) {
    return this.prisma.employee.create({
      data,
      include: this.employeeInclude,
    });
  }

  async findAll(
    where:
      Prisma.EmployeeWhereInput = {},
  ) {
    return this.prisma.employee.findMany({
      where: {
        ...where,
        deletedAt: null,
      },

      include:
        this.employeeInclude,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(
    companyId: bigint,
    id: bigint,
  ) {
    return this.prisma.employee.findFirst({
      where: {
        id,
        companyId,
        deletedAt: null,
      },

      include:
        this.employeeInclude,
    });
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.employee.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },

      include:
        this.employeeInclude,
    });
  }

  async findByEmail(
    companyId: bigint,
    email: string,
  ) {
    return this.prisma.employee.findFirst({
      where: {
        companyId,
        email,
        deletedAt: null,
      },
    });
  }

  async findByMobile(
    companyId: bigint,
    mobile: string,
  ) {
    return this.prisma.employee.findFirst({
      where: {
        companyId,
        mobile,
        deletedAt: null,
      },
    });
  }

  async findByEmployeeCode(
    companyId: bigint,
    employeeCode: string,
  ) {
    return this.prisma.employee.findFirst({
      where: {
        companyId,
        employeeCode,
        deletedAt: null,
      },
    });
  }

  async update(
    id: bigint,
    data: Prisma.EmployeeUpdateInput,
  ) {
    return this.prisma.employee.update({
      where: {
        id,
      },

      data,

      include:
        this.employeeInclude,
    });
  }

  async softDelete(
    id: bigint,
  ) {
    return this.prisma.employee.update({
      where: {
        id,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          Status.INACTIVE,
      },

      include:
        this.employeeInclude,
    });
  }

  async count(
    companyId: bigint,
  ) {
    return this.prisma.employee.count({
      where: {
        companyId,
        deletedAt: null,
      },
    });
  }
}