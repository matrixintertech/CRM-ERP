import {
  Injectable,
} from "@nestjs/common";

import {
  PermissionType,
  Prisma,
  Status,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

import {
  CreatePermissionDto,
} from "../dto/create-permission.dto";

import {
  UpdatePermissionDto,
} from "../dto/update-permission.dto";

import {
  PermissionModule,
} from "../enums/permission-module.enum";

export interface FindPermissionsParams {
  page?: number;
  limit?: number;

  search?: string;

  module?: PermissionModule;

  type?: PermissionType;

  status?: Status;

  sortBy?:
    | "name"
    | "module"
    | "code"
    | "status";

  sortOrder?:
    | "asc"
    | "desc";
}

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

        module:
          data.module,

        type:
          data.type,

        name:
          data.name.trim(),

        code:
          data.code
            .trim()
            .toLowerCase(),

        description:
          data.description
            ?.trim(),
      },
    });
  }

  async findAll(
    params: FindPermissionsParams = {},
  ) {
    const page =
      Math.max(
        1,
        params.page ?? 1,
      );

    const limit =
      Math.min(
        Math.max(
          1,
          params.limit ?? 10,
        ),
        100,
      );

    const skip =
      (page - 1) *
      limit;

    const search =
      params.search
        ?.trim();

    const sortBy =
      params.sortBy ??
      "name";

    const sortOrder:
      Prisma.SortOrder =
        params.sortOrder ??
        "asc";

    const where:
      Prisma.PermissionWhereInput = {
        deletedAt:
          null,

        ...(params.module !==
          undefined && {
          module:
            params.module,
        }),

        ...(params.type !==
          undefined && {
          type:
            params.type,
        }),

        ...(params.status !==
          undefined && {
          status:
            params.status,
        }),

        ...(search && {
          OR: [
            {
              name: {
                contains:
                  search,

                mode:
                  "insensitive",
              },
            },

            {
              code: {
                contains:
                  search,

                mode:
                  "insensitive",
              },
            },

            {
              module: {
                contains:
                  search,

                mode:
                  "insensitive",
              },
            },

            {
              description: {
                contains:
                  search,

                mode:
                  "insensitive",
              },
            },
          ],
        }),
      };

    const orderBy:
      Prisma.PermissionOrderByWithRelationInput =
        {
          [sortBy]:
            sortOrder,
        };

    const [
      permissions,
      total,
    ] =
      await this.prisma.$transaction([
        this.prisma.permission.findMany({
          where,

          skip,

          take:
            limit,

          orderBy,
        }),

        this.prisma.permission.count({
          where,
        }),
      ]);

    return {
      permissions,

      pagination: {
        page,

        limit,

        total,

        totalPages:
          Math.max(
            1,
            Math.ceil(
              total /
                limit,
            ),
          ),
      },
    };
  }

  async findModules(
    type?: PermissionType,
  ) {
    const modules =
      await this.prisma.permission.findMany({
        where: {
          deletedAt:
            null,

          ...(type !==
            undefined && {
            type,
          }),
        },

        select: {
          module:
            true,
        },

        distinct: [
          "module",
        ],

        orderBy: {
          module:
            "asc",
        },
      });

    return modules.map(
      (item) =>
        item.module,
    );
  }

  findActive(
    type?: PermissionType,
  ) {
    return this.prisma.permission.findMany({
      where: {
        deletedAt:
          null,

        status:
          Status.ACTIVE,

        ...(type !==
          undefined && {
          type,
        }),
      },

      orderBy: [
        {
          module:
            "asc",
        },

        {
          name:
            "asc",
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

        deletedAt:
          null,
      },
    });
  }

  findByUuid(
    uuid: string,
  ) {
    return this.prisma.permission.findFirst({
      where: {
        uuid,

        deletedAt:
          null,
      },
    });
  }

  findByCode(
    code: string,
  ) {
    return this.prisma.permission.findFirst({
      where: {
        code:
          code
            .trim()
            .toLowerCase(),

        deletedAt:
          null,
      },
    });
  }

  findByUuids(
    uuids: string[],
    type?: PermissionType,
  ) {
    return this.prisma.permission.findMany({
      where: {
        uuid: {
          in:
            uuids,
        },

        status:
          Status.ACTIVE,

        deletedAt:
          null,

        ...(type !==
          undefined && {
          type,
        }),
      },
    });
  }

  update(
    uuid: string,
    data: UpdatePermissionDto,
  ) {
    const payload:
      Prisma.PermissionUpdateInput = {
        ...(data.module !==
          undefined && {
          module:
            data.module,
        }),

        ...(data.type !==
          undefined && {
          type:
            data.type,
        }),

        ...(data.name !==
          undefined && {
          name:
            data.name.trim(),
        }),

        ...(data.code !==
          undefined && {
          code:
            data.code
              .trim()
              .toLowerCase(),
        }),

        ...(data.description !==
          undefined && {
          description:
            data.description
              .trim() ||
            null,
        }),

        ...(data.status !==
          undefined && {
          status:
            data.status,
        }),
      };

    return this.prisma.permission.update({
      where: {
        uuid,
      },

      data:
        payload,
    });
  }

  softDelete(
    uuid: string,
  ) {
    return this.prisma.permission.update({
      where: {
        uuid,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          Status.INACTIVE,
      },
    });
  }

  async findGrouped(
    type?: PermissionType,
  ) {
    return this.prisma.permission.findMany({
      where: {
        deletedAt:
          null,

        status:
          Status.ACTIVE,

        ...(type !==
          undefined && {
          type,
        }),
      },

      orderBy: [
        {
          module:
            "asc",
        },

        {
          name:
            "asc",
        },
      ],
    });
  }
}