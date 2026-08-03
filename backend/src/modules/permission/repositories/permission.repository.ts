import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  Status,
} from "@prisma/client";

import { PrismaService } from "src/database/prisma.service";

import { CreatePermissionDto } from "../dto/create-permission.dto";
import { UpdatePermissionDto } from "../dto/update-permission.dto";

@Injectable()
export class PermissionRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  create(
    data: CreatePermissionDto,
  ) {
    return this.prisma.permission.create({
      data: {
        ...data,

        code:
          data.code
            .trim()
            .toLowerCase(),

        module:
          data.module.trim(),

        name:
          data.name.trim(),

        description:
          data.description?.trim(),
      },
    });
  }

  findAll() {
    return this.prisma.permission.findMany({
      where: {
        deletedAt: null,
      },

      orderBy: [
        {
          module: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }

  findActive() {
    return this.prisma.permission.findMany({
      where: {
        deletedAt: null,
        status: Status.ACTIVE,
      },

      orderBy: [
        {
          module: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }

  findById(
    id: bigint,
  ) {
    return this.prisma.permission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  findByUuid(
    uuid: string,
  ) {
    return this.prisma.permission.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    });
  }

  findByCode(
    code: string,
  ) {
    return this.prisma.permission.findFirst({
      where: {
        code:
          code.trim().toLowerCase(),

        deletedAt: null,
      },
    });
  }

  findByUuids(
    uuids: string[],
  ) {
    return this.prisma.permission.findMany({
      where: {
        uuid: {
          in: uuids,
        },

        status: Status.ACTIVE,
        deletedAt: null,
      },
    });
  }

  update(
    id: bigint,
    data: UpdatePermissionDto,
  ) {
    const payload:
      Prisma.PermissionUpdateInput = {
      ...(data.module !== undefined && {
        module:
          data.module.trim(),
      }),

      ...(data.name !== undefined && {
        name:
          data.name.trim(),
      }),

      ...(data.code !== undefined && {
        code:
          data.code
            .trim()
            .toLowerCase(),
      }),

      ...(data.description !==
        undefined && {
        description:
          data.description.trim() ||
          null,
      }),

      ...(data.status !== undefined && {
        status:
          data.status,
      }),
    };

    return this.prisma.permission.update({
      where: {
        id,
      },

      data: payload,
    });
  }

  softDelete(
    id: bigint,
  ) {
    return this.prisma.permission.update({
      where: {
        id,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          Status.INACTIVE,
      },
    });
  }

async findGrouped() {
  return this.prisma.permission.findMany({
    where: {
      deletedAt: null,
      status: "ACTIVE",
    },

    orderBy: [
      {
        module: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}
}