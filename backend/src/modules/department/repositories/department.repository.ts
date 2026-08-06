import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, Status } from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

import { CreateDepartmentDto } from '../dto/create-department.dto';

@Injectable()
export class DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    companyId: bigint,
    organizationUnitId: bigint,
    dto: CreateDepartmentDto,
  ) {
    return this.prisma.department.create({
      data: {
        companyId,
        organizationUnitId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
      },
      include: {
        organizationUnit: true,
      },
    });
  }

  async findAll(companyId?: bigint) {
    return this.prisma.department.findMany({
      where: {
        deletedAt: null,

        ...(companyId !== undefined
          ? {
              companyId,
            }
          : {}),
      },

      include: {
        organizationUnit: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(companyId: bigint, id: bigint) {
    return this.prisma.department.findFirst({
      where: {
        id,
        companyId,
        deletedAt: null,
      },
      include: {
        organizationUnit: true,
      },
    });
  }

  async findByName(
    companyId: bigint,
    organizationUnitId: bigint,
    name: string,
  ) {
    return this.prisma.department.findFirst({
      where: {
        companyId,
        organizationUnitId,
        name,
        deletedAt: null,
      },
    });
  }

  async findByCode(
    companyId: bigint,
    organizationUnitId: bigint,
    code: string,
  ) {
    return this.prisma.department.findFirst({
      where: {
        companyId,
        organizationUnitId,
        code,
        deletedAt: null,
      },
    });
  }

  async findByUuid(companyId: bigint, uuid: string) {
    return this.prisma.department.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },
      include: {
        organizationUnit: true,
      },
    });
  }

  async update(
    companyId: bigint,
    id: bigint,
    data: Prisma.DepartmentUpdateInput,
  ) {
    const department = await this.prisma.department.findFirst({
      where: {
        id,
        companyId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found.');
    }

    return this.prisma.department.update({
      where: {
        id: department.id,
      },
      data,
      include: {
        organizationUnit: true,
      },
    });
  }

  async softDelete(companyId: bigint, id: bigint) {
    const department = await this.prisma.department.findFirst({
      where: {
        id,
        companyId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found.');
    }

    return this.prisma.department.update({
      where: {
        id: department.id,
      },
      data: {
        deletedAt: new Date(),
        status: Status.INACTIVE,
      },
      include: {
        organizationUnit: true,
      },
    });
  }
}
