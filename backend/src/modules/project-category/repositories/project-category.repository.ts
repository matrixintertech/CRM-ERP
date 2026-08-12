import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
  Status,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

@Injectable()
export class ProjectCategoryRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly include = {
    company: true,
  } satisfies Prisma.ProjectCategoryInclude;

  async create(
    data:
      Prisma.ProjectCategoryCreateInput,
  ) {
    return this.prisma.projectCategory.create({
      data,
      include: this.include,
    });
  }

  async findAll(
    companyId: bigint,
  ) {
    return this.prisma.projectCategory.findMany({
      where: {
        companyId,
        deletedAt: null,
      },

      include: this.include,

      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.projectCategory.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },

      include: this.include,
    });
  }

  async findByCode(
    companyId: bigint,
    code: string,
  ) {
    return this.prisma.projectCategory.findFirst({
      where: {
        companyId,
        code,
        deletedAt: null,
      },
    });
  }

  async findByName(
    companyId: bigint,
    name: string,
  ) {
    return this.prisma.projectCategory.findFirst({
      where: {
        companyId,
        name,
        deletedAt: null,
      },
    });
  }

  async update(
    companyId: bigint,
    uuid: string,
    data:
      Prisma.ProjectCategoryUpdateInput,
  ) {
    const category =
      await this.prisma.projectCategory.findFirst({
        where: {
          companyId,
          uuid,
          deletedAt: null,
        },

        select: {
          id: true,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Project category not found.',
      );
    }

    return this.prisma.projectCategory.update({
      where: {
        id: category.id,
      },

      data,

      include: this.include,
    });
  }

  async softDelete(
    companyId: bigint,
    uuid: string,
  ) {
    const category =
      await this.prisma.projectCategory.findFirst({
        where: {
          companyId,
          uuid,
          deletedAt: null,
        },

        select: {
          id: true,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Project category not found.',
      );
    }

    return this.prisma.projectCategory.update({
      where: {
        id: category.id,
      },

      data: {
        status: Status.INACTIVE,
        deletedAt: new Date(),
      },

      include: this.include,
    });
  }

  async countProjects(
    companyId: bigint,
    categoryId: bigint,
  ) {
    return this.prisma.project.count({
      where: {
        companyId,
        categoryId,
        deletedAt: null,
      },
    });
  }
}