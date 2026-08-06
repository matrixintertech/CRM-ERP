import { Injectable } from '@nestjs/common';

import { Prisma, Status } from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProjectCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    company: true,
  } satisfies Prisma.ProjectCategoryInclude;

  async create(data: Prisma.ProjectCategoryCreateInput) {
    return this.prisma.projectCategory.create({
      data,

      include: this.include,
    });
  }

  async findAll(companyId?: bigint) {
    return this.prisma.projectCategory.findMany({
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
        sortOrder: 'asc',
      },
    });
  }

  async findByUuid(companyId: bigint, uuid: string) {
    return this.prisma.projectCategory.findFirst({
      where: {
        companyId,

        uuid,

        deletedAt: null,
      },

      include: this.include,
    });
  }

  async findByCode(companyId: bigint, code: string) {
    return this.prisma.projectCategory.findFirst({
      where: {
        companyId,

        code,

        deletedAt: null,
      },
    });
  }

  async findByName(companyId: bigint, name: string) {
    return this.prisma.projectCategory.findFirst({
      where: {
        companyId,

        name,

        deletedAt: null,
      },
    });
  }

  async update(id: bigint, data: Prisma.ProjectCategoryUpdateInput) {
    return this.prisma.projectCategory.update({
      where: {
        id,
      },

      data,

      include: this.include,
    });
  }

  async softDelete(id: bigint) {
    return this.prisma.projectCategory.update({
      where: {
        id,
      },

      data: {
        status: Status.INACTIVE,

        deletedAt: new Date(),
      },
    });
  }

  async countProjects(categoryId: bigint) {
    return this.prisma.project.count({
      where: {
        categoryId,
        deletedAt: null,
      },
    });
  }
}
