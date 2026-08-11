import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

import {
  ProjectQueryDto,
} from '../dto';

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

    category: {
      select: {
        id: true,
        uuid: true,
        name: true,
        code: true,
      },
    },

    organizationUnit: {
      select: {
        id: true,
        uuid: true,
        name: true,
        code: true,
        type: true,
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
    data:
      Prisma.ProjectUncheckedCreateInput,
  ): Promise<ProjectWithRelations> {
    return this.prisma.project.create({
      data,

      include:
        this.include,
    });
  }

  async findAll(
    companyId: bigint,

    query: ProjectQueryDto,

    scopeWhere?:
      Prisma.ProjectWhereInput,
  ): Promise<{
    projects:
      ProjectWithRelations[];

    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      categoryUuid,
      organizationUnitUuid,
      stateUuid,
      cityUuid,
      status,
    } = query;

    const normalizedSearch =
      search?.trim();

    const where:
      Prisma.ProjectWhereInput = {
      /*
       * Hard tenant boundary.
       *
       * Ye authorization scope ke
       * through kabhi override nahi hoga.
       */
      companyId,

      deletedAt:
        null,

      ...(status && {
        status,
      }),

      ...(categoryUuid && {
        category: {
          uuid:
            categoryUuid,
        },
      }),

      ...(organizationUnitUuid && {
        organizationUnit: {
          uuid:
            organizationUnitUuid,
        },
      }),

      ...(stateUuid && {
        state: {
          uuid:
            stateUuid,
        },
      }),

      ...(cityUuid && {
        city: {
          uuid:
            cityUuid,
        },
      }),

      ...(normalizedSearch && {
        OR: [
          {
            name: {
              contains:
                normalizedSearch,

              mode:
                'insensitive',
            },
          },

          {
            srn: {
              contains:
                normalizedSearch,

              mode:
                'insensitive',
            },
          },

          {
            client: {
              name: {
                contains:
                  normalizedSearch,

                mode:
                  'insensitive',
              },
            },
          },
        ],
      }),

      /*
       * Permission scope filter.
       *
       * Existing query filters ke
       * saath AND hoga.
       */
      ...(scopeWhere && {
        AND: [
          scopeWhere,
        ],
      }),
    };

    const [
      projects,
      total,
    ] =
      await this.prisma.$transaction([
        this.prisma.project.findMany({
          where,

          include:
            this.include,

          skip:
            (page - 1) * limit,

          take:
            limit,

          orderBy: {
            createdAt:
              'desc',
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

        deletedAt:
          null,
      },
    });
  }

  async findByUuid(
    companyId: bigint,

    uuid: string,

    scopeWhere?:
      Prisma.ProjectWhereInput,
  ): Promise<ProjectWithRelations | null> {
    return this.prisma.project.findFirst({
      where: {
        uuid,

        companyId,

        deletedAt:
          null,

        /*
         * Detail endpoint par bhi
         * scope enforce hoga.
         */
        ...(scopeWhere && {
          AND: [
            scopeWhere,
          ],
        }),
      },

      include:
        this.include,
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

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  async update(
    companyId: bigint,

    uuid: string,

    data:
      Prisma.ProjectUncheckedUpdateInput,
  ): Promise<ProjectWithRelations> {
    const project =
      await this.prisma.project.findFirst({
        where: {
          uuid,

          companyId,

          deletedAt:
            null,
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
        id:
          project.id,
      },

      data,

      include:
        this.include,
    });
  }

  async delete(
    companyId: bigint,

    uuid: string,
  ): Promise<void> {
    const result =
      await this.prisma.project.updateMany({
        where: {
          uuid,

          companyId,

          deletedAt:
            null,
        },

        data: {
          deletedAt:
            new Date(),
        },
      });

    if (
      result.count ===
      0
    ) {
      throw new NotFoundException(
        'Project not found.',
      );
    }
  }

  async findLatestSRN(
  companyId: bigint,
  year: number,
): Promise<{
  srn: string;
} | null> {
  return this.prisma.project.findFirst({
    where: {
      companyId,

      srn: {
        startsWith:
          `SRN-${year}-`,
      },

      /*
       * deletedAt filter intentionally
       * nahi lagana.
       *
       * Soft deleted project ka SRN
       * bhi permanently consumed rahe.
       */
    },

    select: {
      srn:
        true,
    },

    orderBy: {
      id:
        'desc',
    },
  });
}
}