import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DesignationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    department: {
      select: {
        id: true,
        uuid: true,
        name: true,
        code: true,

        organizationUnit: {
          select: {
            id: true,
            uuid: true,
            name: true,
            code: true,
            type: true,
          },
        },
      },
    },
  } satisfies Prisma.DesignationInclude;

  async create(data: Prisma.DesignationCreateInput) {
    return this.prisma.designation.create({
      data,
      include: this.include,
    });
  }

  async findAll(companyId?: bigint) {
    return this.prisma.designation.findMany({
      where: {
        deletedAt: null,

        ...(companyId !== undefined
          ? {
              companyId,
            }
          : {}),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async findById(companyId: bigint, id: bigint) {
    return this.prisma.designation.findFirst({
      where: {
        id,
        companyId,
        deletedAt: null,
      },

      include: this.include,
    });
  }

  async findByUuid(companyId: bigint, uuid: string) {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },

      include: this.include,
    });
  }

  async findByName(companyId: bigint, departmentId: bigint, name: string) {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        departmentId,
        name,
        deletedAt: null,
      },
    });
  }

  async findByCode(companyId: bigint, departmentId: bigint, code: string) {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        departmentId,
        code,
        deletedAt: null,
      },
    });
  }

  async update(id: bigint, data: Prisma.DesignationUpdateInput) {
    return this.prisma.designation.update({
      where: {
        id,
      },

      data,

      include: this.include,
    });
  }

  async softDelete(id: bigint) {
    return this.prisma.designation.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },

      include: this.include,
    });
  }
}
