import { Injectable } from '@nestjs/common';
import { Prisma, Project, Status  } from '@prisma/client';

import { PrismaService } from "src/database/prisma.service";

import { IProjectRepository } from './project.repository.interface';
import { ProjectWithRelations } from '../types/project.types';

import { ProjectQueryDto } from '../dto';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private readonly include = {
    client: {
      select: {
        id: true,
        uuid: true,
        name: true,
        code: true,
        contactName: true,
        mobile: true,
      },
    },
    state: {
      select: {
        id: true,
        uuid: true,
        name: true,
      },
    },
    city: {
      select: {
        id: true,
        uuid: true,
        name: true,
      },
    },
  } satisfies Prisma.ProjectInclude;

  async create(
    data: Prisma.ProjectUncheckedCreateInput,
  ): Promise<ProjectWithRelations> {
    return this.prisma.project.create({
      data,
      include: this.include,
    });
  }

async findAll(
  companyId: bigint,
  query: ProjectQueryDto,
): Promise<{
  projects: ProjectWithRelations[];
  total: number;
}> {
  const { page = 1, limit = 10, search } = query;

const where: Prisma.ProjectWhereInput = {
  companyId,
  deletedAt: null,
  ...(search && {
    OR: [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        srn: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        client: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
    ],
  }),
};

  const [projects, total] = await this.prisma.$transaction([
    this.prisma.project.findMany({
      where,
      include: this.include,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),

    this.prisma.project.count({
      where,
    }),
  ]);

  return {
    projects,
    total,
  };
}

  async count(
    companyId: bigint,
  ): Promise<number> {
    return this.prisma.project.count({
      where: {
        companyId,
        deletedAt: null,
      },
    });
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ): Promise<ProjectWithRelations | null> {
    return this.prisma.project.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },
      include: this.include,
    });
  }

  async findBySRN(
    companyId: bigint,
    srn: string,
  ): Promise<ProjectWithRelations | null> {
    return this.prisma.project.findFirst({
      where: {
        companyId,
        srn,
        deletedAt: null,
      },
      include: this.include,
    });
  }

  async update(
    companyId: bigint,
    uuid: string,
    data: Prisma.ProjectUncheckedUpdateInput,
  ): Promise<ProjectWithRelations> {
    return this.prisma.project.update({
      where: {
        uuid,
      },
      data,
      include: this.include,
    });
  }

  async delete(
    companyId: bigint,
    uuid: string,
  ): Promise<void> {
    await this.prisma.project.updateMany({
      where: {
        companyId,
        uuid,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }


}