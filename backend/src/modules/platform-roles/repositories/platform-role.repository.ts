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

export interface FindPlatformRolesParams {
  status?: Status;

  search?: string;
}

@Injectable()
export class PlatformRoleRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly include = {
    permissions: {
      include: {
        permission: true,
      },
    },

    _count: {
      select: {
        users: true,
      },
    },
  } satisfies Prisma.PlatformRoleInclude;

  private readonly permissionSelect = {
    id: true,
    uuid: true,

    module: true,

    name: true,

    code: true,

    description: true,

    type: true,

    status: true,
  } satisfies Prisma.PermissionSelect;

  /*
   * Create platform role.
   */
  async create(
    data:
      Prisma.PlatformRoleCreateInput,
  ) {
    return this.prisma.platformRole.create({
      data,

      include:
        this.include,
    });
  }

  /*
   * Get platform roles.
   */
  async findAll(
    params:
      FindPlatformRolesParams = {},
  ) {
    const normalizedSearch =
      params.search
        ?.trim();

    return this.prisma.platformRole.findMany({
      where: {
        deletedAt:
          null,

        ...(params.status !==
          undefined && {
          status:
            params.status,
        }),

        ...(normalizedSearch && {
          OR: [
            {
              name: {
                contains:
                  normalizedSearch,

                mode:
                  "insensitive",
              },
            },

            {
              code: {
                contains:
                  normalizedSearch,

                mode:
                  "insensitive",
              },
            },
          ],
        }),
      },

      include:
        this.include,

      orderBy: {
        name:
          "asc",
      },
    });
  }

  /*
   * Active roles for dropdowns.
   */
  async findDropdown() {
    return this.prisma.platformRole.findMany({
      where: {
        status:
          Status.ACTIVE,

        deletedAt:
          null,
      },

      select: {
        uuid: true,

        name: true,

        code: true,
      },

      orderBy: {
        name:
          "asc",
      },
    });
  }

  /*
   * Find platform role by internal ID.
   */
  async findById(
    id: bigint,
  ) {
    return this.prisma.platformRole.findFirst({
      where: {
        id,

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  /*
   * Find platform role by UUID.
   */
  async findByUuid(
    uuid: string,
  ) {
    return this.prisma.platformRole.findFirst({
      where: {
        uuid,

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  /*
   * Duplicate code validation.
   */
  async findByCode(
    code: string,
  ) {
    return this.prisma.platformRole.findFirst({
      where: {
        code,

        deletedAt:
          null,
      },
    });
  }

  /*
   * Duplicate name validation.
   */
  async findByName(
    name: string,
  ) {
    return this.prisma.platformRole.findFirst({
      where: {
        name,

        deletedAt:
          null,
      },
    });
  }

  /*
   * Update platform role.
   */
  async update(
    id: bigint,

    data:
      Prisma.PlatformRoleUpdateInput,
  ) {
    return this.prisma.platformRole.update({
      where: {
        id,
      },

      data,

      include:
        this.include,
    });
  }

  /*
   * Soft delete platform role.
   */
  async softDelete(
    id: bigint,
  ) {
    return this.prisma.platformRole.update({
      where: {
        id,
      },

      data: {
        status:
          Status.INACTIVE,

        deletedAt:
          new Date(),
      },

      include:
        this.include,
    });
  }

  /*
   * Get permissions assigned to
   * a PlatformRole.
   *
   * Important:
   * PLATFORM permissions only.
   */
  async findRolePermissions(
    platformRoleUuid:
      string,
  ) {
    const role =
      await this.prisma.platformRole.findFirst({
        where: {
          uuid:
            platformRoleUuid,

          deletedAt:
            null,
        },

        select: {
          id: true,

          uuid: true,

          name: true,

          code: true,
        },
      });

    if (!role) {
      return null;
    }

    const rolePermissions =
      await this.prisma.platformRolePermission.findMany({
        where: {
          platformRoleId:
            role.id,

          permission: {
            type:
              PermissionType.PLATFORM,

            status:
              Status.ACTIVE,

            deletedAt:
              null,
          },
        },

        include: {
          permission: {
            select:
              this.permissionSelect,
          },
        },

        orderBy: {
          permission: {
            module:
              "asc",
          },
        },
      });

    return {
      role,

      rolePermissions,
    };
  }

  /*
   * Replace all permissions assigned
   * to a PlatformRole.
   *
   * Only PLATFORM permissions are valid.
   */
async assignPermissions(
  platformRoleUuid:
    string,

  permissionUuids:
    string[],
) {
  const role =
    await this.prisma.platformRole.findFirst({
      where: {
        uuid:
          platformRoleUuid,

        deletedAt:
          null,
      },

      select: {
        id: true,

        uuid: true,

        name: true,

        code: true,
      },
    });

  if (!role) {
    return null;
  }

  const uniquePermissionUuids =
    Array.from(
      new Set(
        permissionUuids,
      ),
    );

  const permissions =
    uniquePermissionUuids.length >
    0
      ? await this.prisma.permission.findMany({
          where: {
            uuid: {
              in:
                uniquePermissionUuids,
            },

            type:
              PermissionType.PLATFORM,

            status:
              Status.ACTIVE,

            deletedAt:
              null,
          },

          select: {
            id: true,

            uuid: true,

            module: true,

            name: true,

            code: true,

            description: true,

            type: true,

            status: true,
          },
        })
      : [];

  /*
   * IMPORTANT:
   *
   * Mutation se pehle validate karo.
   *
   * Agar requested UUID me koi:
   *
   * - missing permission
   * - inactive permission
   * - deleted permission
   * - COMPANY permission
   *
   * hai, to existing role permissions
   * bilkul change nahi honge.
   */
  if (
    permissions.length !==
    uniquePermissionUuids.length
  ) {
    return {
      role,

      requestedPermissionCount:
        uniquePermissionUuids.length,

      assignedPermissionCount:
        permissions.length,

      permissions:
        [],
    };
  }

  /*
   * Validation successful hone ke
   * baad hi existing permissions
   * replace karo.
   */
  await this.prisma.$transaction(
    async (
      tx,
    ) => {
      await tx.platformRolePermission.deleteMany({
        where: {
          platformRoleId:
            role.id,
        },
      });

      if (
        permissions.length >
        0
      ) {
        await tx.platformRolePermission.createMany({
          data:
            permissions.map(
              (
                permission,
              ) => ({
                platformRoleId:
                  role.id,

                permissionId:
                  permission.id,
              }),
            ),
        });
      }
    },
  );

  return {
    role,

    requestedPermissionCount:
      uniquePermissionUuids.length,

    assignedPermissionCount:
      permissions.length,

    permissions:
      permissions.map(
        (
          permission,
        ) => ({
          uuid:
            permission.uuid,

          module:
            permission.module,

          name:
            permission.name,

          code:
            permission.code,

          description:
            permission.description,

          type:
            permission.type,

          status:
            permission.status,
        }),
      ),
  };
}
  /*
   * User assignment validation ke liye.
   */
  async findActiveByUuid(
    uuid: string,
  ) {
    return this.prisma.platformRole.findFirst({
      where: {
        uuid,

        status:
          Status.ACTIVE,

        deletedAt:
          null,
      },

      select: {
        id: true,

        uuid: true,

        name: true,

        code: true,

        isSystem: true,

        status: true,
      },
    });
  }
}