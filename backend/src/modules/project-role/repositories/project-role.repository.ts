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
export class ProjectRoleRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    data:
      Prisma.ProjectRoleCreateInput,
  ) {
    return this.prisma.projectRole.create({
      data,

      include: {
        requiredRole: true,
      },
    });
  }

  async findAll(
    companyId: bigint,
  ) {
    return this.prisma.projectRole.findMany({
      where: {
        companyId,

        deletedAt:
          null,
      },

      include: {
        requiredRole: true,
      },

      orderBy: [
        {
          sortOrder:
            "asc",
        },
        {
          name:
            "asc",
        },
      ],
    });
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.projectRole.findFirst({
      where: {
        companyId,

        uuid,

        deletedAt:
          null,
      },

      include: {
        requiredRole: true,
      },
    });
  }

  async findByName(
    companyId: bigint,
    name: string,
  ) {
    return this.prisma.projectRole.findFirst({
      where: {
        companyId,

        name,

        deletedAt:
          null,
      },
    });
  }

  async findByCode(
    companyId: bigint,
    code: string,
  ) {
    return this.prisma.projectRole.findFirst({
      where: {
        companyId,

        code,

        deletedAt:
          null,
      },
    });
  }

  async findRequiredRoleByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.projectRole.findFirst({
      where: {
        companyId,

        uuid,

        deletedAt:
          null,

        status:
          Status.ACTIVE,
      },
    });
  }

  async update(
    companyId: bigint,
    uuid: string,
    data:
      Prisma.ProjectRoleUpdateInput,
  ) {
    /*
     * Tenant-safe lookup first.
     *
     * UUID globally unique hai,
     * phir bhi companyId boundary
     * deliberately enforce kar rahe hain.
     */
    const projectRole =
      await this.prisma.projectRole.findFirst({
        where: {
          companyId,

          uuid,

          deletedAt:
            null,
        },

        select: {
          id: true,
        },
      });

    if (!projectRole) {
      return null;
    }

    return this.prisma.projectRole.update({
      where: {
        id:
          projectRole.id,
      },

      data,

      include: {
        requiredRole: true,
      },
    });
  }

  async softDelete(
    companyId: bigint,
    uuid: string,
  ) {
    const projectRole =
      await this.prisma.projectRole.findFirst({
        where: {
          companyId,

          uuid,

          deletedAt:
            null,
        },

        select: {
          id: true,
        },
      });

    if (!projectRole) {
      return null;
    }

    return this.prisma.projectRole.update({
      where: {
        id:
          projectRole.id,
      },

      data: {
        status:
          Status.INACTIVE,

        deletedAt:
          new Date(),
      },
    });
  }

  async countActiveMembers(
    companyId: bigint,
    projectRoleId: bigint,
  ) {
    return this.prisma.projectMember.count({
      where: {
        companyId,

        projectRoleId,

        isActive:
          true,

        removedAt:
          null,
      },
    });
  }

  async countDependentRoles(
    companyId: bigint,
    projectRoleId: bigint,
  ) {
    return this.prisma.projectRole.count({
      where: {
        companyId,

        requiredRoleId:
          projectRoleId,

        deletedAt:
          null,
      },
    });
  }

  async findById(
    companyId: bigint,
    id: bigint,
  ) {
    return this.prisma.projectRole.findFirst({
      where: {
        companyId,

        id,

        deletedAt:
          null,
      },
    });
  }
}