import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  Status,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

@Injectable()
export class ProjectMemberRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async findProjectByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.project.findFirst({
      where: {
        uuid,
        companyId,
        deletedAt: null,
        status: Status.ACTIVE,
      },
    });
  }

  async findEmployeeByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.employee.findFirst({
      where: {
        uuid,
        companyId,
        deletedAt: null,
        status: Status.ACTIVE,
      },

      include: {
        designation: true,
        department: true,
      },
    });
  }

  async findProjectRoleByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.projectRole.findFirst({
      where: {
        uuid,
        companyId,
        deletedAt: null,
        status: Status.ACTIVE,
      },

      include: {
        requiredRole: true,
      },
    });
  }

  async findActiveByProjectAndRole(
    projectId: bigint,
    projectRoleId: bigint,
  ) {
    return this.prisma.projectMember.findFirst({
      where: {
        projectId,
        projectRoleId,
        isActive: true,
      },

      include: {
        employee: true,
        projectRole: true,
      },
    });
  }

  async findActiveByProjectEmployeeRole(
    projectId: bigint,
    employeeId: bigint,
    projectRoleId: bigint,
  ) {
    return this.prisma.projectMember.findFirst({
      where: {
        projectId,
        employeeId,
        projectRoleId,
        isActive: true,
      },
    });
  }

  async findActiveRequiredRoleAssignment(
    projectId: bigint,
    requiredRoleId: bigint,
  ) {
    return this.prisma.projectMember.findFirst({
      where: {
        projectId,
        projectRoleId:
          requiredRoleId,
        isActive: true,
      },
    });
  }

  async create(
    data:
      Prisma.ProjectMemberCreateInput,
  ) {
    return this.prisma.projectMember.create({
      data,

      include: {
        employee: {
          include: {
            designation: true,
            department: true,
          },
        },

        projectRole: {
          include: {
            requiredRole: true,
          },
        },

        project: true,
      },
    });
  }

  async findAllByProject(
    companyId: bigint,
    projectId: bigint,
    activeOnly = true,
  ) {
    return this.prisma.projectMember.findMany({
      where: {
        companyId,
        projectId,

        ...(activeOnly && {
          isActive: true,
        }),
      },

      include: {
        employee: {
          include: {
            designation: true,
            department: true,
          },
        },

        projectRole: {
          include: {
            requiredRole: true,
          },
        },
      },

      orderBy: [
        {
          projectRole: {
            sortOrder: "asc",
          },
        },
        {
          assignedAt: "asc",
        },
      ],
    });
  }

  async findByUuid(
    companyId: bigint,
    projectId: bigint,
    uuid: string,
  ) {
    return this.prisma.projectMember.findFirst({
      where: {
        uuid,
        companyId,
        projectId,
      },

      include: {
        employee: {
          include: {
            designation: true,
            department: true,
          },
        },

        projectRole: {
          include: {
            requiredRole: true,
          },
        },

        project: true,
      },
    });
  }

  async update(
    id: bigint,
    data:
      Prisma.ProjectMemberUpdateInput,
  ) {
    return this.prisma.projectMember.update({
      where: {
        id,
      },

      data,

      include: {
        employee: {
          include: {
            designation: true,
            department: true,
          },
        },

        projectRole: {
          include: {
            requiredRole: true,
          },
        },
      },
    });
  }

  async deactivate(
    id: bigint,
  ) {
    return this.prisma.projectMember.update({
      where: {
        id,
      },

      data: {
        isActive: false,
        removedAt:
          new Date(),
      },
    });
  }

  async deactivateByProjectAndRole(
    projectId: bigint,
    projectRoleId: bigint,
  ) {
    return this.prisma.projectMember.updateMany({
      where: {
        projectId,
        projectRoleId,
        isActive: true,
      },

      data: {
        isActive: false,
        removedAt:
          new Date(),
      },
    });
  }

  async findActiveAssignmentsDependingOnRole(
  projectId: bigint,
  requiredRoleId: bigint,
) {
  return this.prisma.projectMember.findMany({
    where: {
      projectId,
      isActive: true,

      projectRole: {
        requiredRoleId,
      },
    },

    include: {
      employee: true,
      projectRole: true,
    },
  });
}
}