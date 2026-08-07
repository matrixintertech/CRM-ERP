import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  ProjectTaskStatus,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

@Injectable()
export class ProjectTaskRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async findProjectByUuid(
    companyId: bigint,
    projectUuid: string,
  ) {
    return this.prisma.project.findFirst({
      where: {
        uuid:
          projectUuid,

        companyId,

        deletedAt:
          null,
      },
    });
  }

  async findActiveProjectMemberByUuid(
    companyId: bigint,
    projectId: bigint,
    memberUuid: string,
  ) {
    return this.prisma.projectMember.findFirst({
      where: {
        uuid:
          memberUuid,

        companyId,

        projectId,

        isActive:
          true,
      },

      include: {
        employee: {
          include: {
            designation:
              true,

            department:
              true,
          },
        },

        projectRole:
          true,
      },
    });
  }

  async create(
    data:
      Prisma.ProjectTaskCreateInput,
  ) {
    return this.prisma.projectTask.create({
      data,

      include: {
        assignedProjectMember: {
          include: {
            employee: {
              include: {
                designation:
                  true,

                department:
                  true,
              },
            },

            projectRole:
              true,
          },
        },

        project:
          true,
      },
    });
  }

  async findAllByProject(
    companyId: bigint,
    projectId: bigint,
  ) {
    return this.prisma.projectTask.findMany({
      where: {
        companyId,

        projectId,

        deletedAt:
          null,
      },

      include: {
        assignedProjectMember: {
          include: {
            employee: {
              include: {
                designation:
                  true,

                department:
                  true,
              },
            },

            projectRole:
              true,
          },
        },
      },

      orderBy: [
        {
          sortOrder:
            "asc",
        },

        {
          dueDate:
            "asc",
        },

        {
          createdAt:
            "desc",
        },
      ],
    });
  }

  async findByUuid(
    companyId: bigint,
    projectId: bigint,
    taskUuid: string,
  ) {
    return this.prisma.projectTask.findFirst({
      where: {
        uuid:
          taskUuid,

        companyId,

        projectId,

        deletedAt:
          null,
      },

      include: {
        assignedProjectMember: {
          include: {
            employee: {
              include: {
                designation:
                  true,

                department:
                  true,
              },
            },

            projectRole:
              true,
          },
        },

        project:
          true,
      },
    });
  }

  async update(
    id: bigint,
    data:
      Prisma.ProjectTaskUpdateInput,
  ) {
    return this.prisma.projectTask.update({
      where: {
        id,
      },

      data,

      include: {
        assignedProjectMember: {
          include: {
            employee: {
              include: {
                designation:
                  true,

                department:
                  true,
              },
            },

            projectRole:
              true,
          },
        },

        project:
          true,
      },
    });
  }

  async softDelete(
    id: bigint,
  ) {
    return this.prisma.projectTask.update({
      where: {
        id,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          ProjectTaskStatus.CANCELLED,
      },
    });
  }
}