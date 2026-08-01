import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

import { ProjectQueryDto } from '../dto';

import type {
  ProjectWithRelations,
} from '../types/project.types';

import type {
  IProjectRepository,
} from './project.repository.interface';

@Injectable()
export class ProjectRepository
  implements IProjectRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
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
    companyId: bigint | null,
    query: ProjectQueryDto,
  ): Promise<{
    projects: ProjectWithRelations[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
    } = query;

    const normalizedSearch =
      search?.trim();

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,

      ...(companyId !== null && {
        companyId,
      }),

      ...(normalizedSearch && {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: 'insensitive',
            },
          },
          {
            srn: {
              contains: normalizedSearch,
              mode: 'insensitive',
            },
          },
          {
            client: {
              name: {
                contains: normalizedSearch,
                mode: 'insensitive',
              },
            },
          },
        ],
      }),
    };

    const [projects, total] =
      await this.prisma.$transaction([
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
    companyId: bigint | null,
  ): Promise<number> {
    return this.prisma.project.count({
      where: {
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },
    });
  }

  async findByUuid(
    companyId: bigint | null,
    uuid: string,
  ): Promise<ProjectWithRelations | null> {
    return this.prisma.project.findFirst({
      where: {
        uuid,
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
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
    companyId: bigint | null,
    uuid: string,
    data: Prisma.ProjectUncheckedUpdateInput,
  ): Promise<ProjectWithRelations> {
    const project =
      await this.prisma.project.findFirst({
        where: {
          uuid,
          deletedAt: null,

          ...(companyId !== null && {
            companyId,
          }),
        },
        select: {
          id: true,
        },
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found.',
      );
    }

    return this.prisma.project.update({
      where: {
        id: project.id,
      },
      data,
      include: this.include,
    });
  }

  async delete(
    companyId: bigint | null,
    uuid: string,
  ): Promise<void> {
    const result =
      await this.prisma.project.updateMany({
        where: {
          uuid,
          deletedAt: null,

          ...(companyId !== null && {
            companyId,
          }),
        },
        data: {
          deletedAt: new Date(),
        },
      });

    if (result.count === 0) {
      throw new NotFoundException(
        'Project not found.',
      );
    }
  }
}