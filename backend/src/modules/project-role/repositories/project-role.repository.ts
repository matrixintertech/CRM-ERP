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
    });
  }

  async findAll(
    companyId?: bigint,
  ) {
    return this.prisma.projectRole.findMany({
      where: {
        ...(companyId !== undefined && {
          companyId,
        }),

        deletedAt: null,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }

  async findByUuid(
    companyId: bigint | undefined,
    uuid: string,
  ) {
    return this.prisma.projectRole.findFirst({
      where: {
        uuid,

        ...(companyId !== undefined && {
          companyId,
        }),

        deletedAt: null,
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
        deletedAt: null,
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
        deletedAt: null,
      },
    });
  }

  async update(
    id: bigint,
    data:
      Prisma.ProjectRoleUpdateInput,
  ) {
    return this.prisma.projectRole.update({
      where: {
        id,
      },

      data,
    });
  }

  async softDelete(
    id: bigint,
  ) {
    return this.prisma.projectRole.update({
      where: {
        id,
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
    projectRoleId: bigint,
  ) {
    return this.prisma.projectMember.count({
      where: {
        projectRoleId,
        isActive: true,
      },
    });
  }
}