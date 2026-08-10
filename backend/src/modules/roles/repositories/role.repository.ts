import {
  Injectable,
} from '@nestjs/common';

import {
  PermissionScope,
  PermissionType,
  Prisma,
  Status,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

export interface RolePermissionAssignment {
  permissionUuid: string;
  scope: PermissionScope;
}

@Injectable()
export class RoleRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly include = {
    rolePermissions: {
      include: {
        permission: true,
      },
    },

    _count: {
      select: {
        users: true,
      },
    },
  } satisfies Prisma.RoleInclude;

  async create(
    data: Prisma.RoleCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client =
      tx ?? this.prisma;

    return client.role.create({
      data,

      include:
        this.include,
    });
  }

  async findCompanyById(
    id: bigint,
  ) {
    return this.prisma.company.findFirst({
      where: {
        id,

        deletedAt:
          null,
      },
    });
  }

  async findCompanyByUuid(
    uuid: string,
  ) {
    return this.prisma.company.findFirst({
      where: {
        uuid,

        deletedAt:
          null,
      },
    });
  }

  async findById(
    companyId: bigint,
    id: bigint,
  ) {
    return this.prisma.role.findFirst({
      where: {
        id,

        companyId,

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.role.findFirst({
      where: {
        uuid,

        companyId,

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  async findByCompanyId(
    companyId: bigint,
  ) {
    return this.prisma.role.findMany({
      where: {
        companyId,

        deletedAt:
          null,
      },

      include:
        this.include,

      orderBy: [
        {
          isSystem:
            'desc',
        },
        {
          name:
            'asc',
        },
      ],
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      where: {
        deletedAt:
          null,
      },

      include:
        this.include,

      orderBy: [
        {
          company: {
            name:
              'asc',
          },
        },
        {
          isSystem:
            'desc',
        },
        {
          name:
            'asc',
        },
      ],
    });
  }

  async findActiveByCompanyId(
    companyId: bigint,
  ) {
    return this.prisma.role.findMany({
      where: {
        companyId,

        status:
          Status.ACTIVE,

        deletedAt:
          null,
      },

      select: {
        uuid:
          true,

        name:
          true,

        code:
          true,

        isSystem:
          true,
      },

      orderBy: {
        name:
          'asc',
      },
    });
  }

  async findByCode(
    companyId: bigint,
    code: string,
  ) {
    return this.prisma.role.findFirst({
      where: {
        companyId,

        code:
          code
            .trim()
            .toUpperCase(),

        deletedAt:
          null,
      },
    });
  }

  async findByName(
    companyId: bigint,
    name: string,
  ) {
    return this.prisma.role.findFirst({
      where: {
        companyId,

        name: {
          equals:
            name.trim(),

          mode:
            'insensitive',
        },

        deletedAt:
          null,
      },
    });
  }

  async update(
    companyId: bigint,
    uuid: string,
    data:
      Prisma.RoleUpdateInput,
  ) {
    const role =
      await this.prisma.role.findFirst({
        where: {
          companyId,

          uuid,

          deletedAt:
            null,
        },

        select: {
          id:
            true,
        },
      });

    if (!role) {
      return null;
    }

    return this.prisma.role.update({
      where: {
        id:
          role.id,
      },

      data,

      include:
        this.include,
    });
  }

  async softDelete(
    companyId: bigint,
    uuid: string,
  ) {
    const role =
      await this.prisma.role.findFirst({
        where: {
          companyId,

          uuid,

          deletedAt:
            null,
        },

        select: {
          id:
            true,
        },
      });

    if (!role) {
      return null;
    }

    return this.prisma.role.update({
      where: {
        id:
          role.id,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          Status.INACTIVE,
      },

      include:
        this.include,
    });
  }

  async findRolePermissions(
    companyId: bigint,
    roleUuid: string,
  ) {
    return this.prisma.rolePermission.findMany({
      where: {
        role: {
          companyId,

          uuid:
            roleUuid,

          deletedAt:
            null,
        },

        permission: {
          type:
            PermissionType.COMPANY,

          deletedAt:
            null,
        },
      },

      select: {
        scope:
          true,

        permission: {
          select: {
            id:
              true,

            uuid:
              true,

            module:
              true,

            name:
              true,

            code:
              true,

            description:
              true,

            type:
              true,

            status:
              true,
          },
        },
      },

      orderBy: [
        {
          permission: {
            module:
              'asc',
          },
        },
        {
          permission: {
            name:
              'asc',
          },
        },
      ],
    });
  }

  async assignPermissions(
    companyId: bigint,
    roleUuid: string,
    assignments:
      RolePermissionAssignment[],
  ) {
    return this.prisma.$transaction(
      async (
        transaction,
      ) => {
        const role =
          await transaction.role.findFirst({
            where: {
              companyId,

              uuid:
                roleUuid,

              deletedAt:
                null,
            },

            select: {
              id:
                true,
            },
          });

        if (!role) {
          return null;
        }

        const permissionUuids =
          assignments.map(
            (
              assignment,
            ) =>
              assignment
                .permissionUuid,
          );

        const uniquePermissionUuids = [
          ...new Set(
            permissionUuids,
          ),
        ];

        const permissions =
          uniquePermissionUuids
            .length > 0
            ? await transaction.permission.findMany({
                where: {
                  uuid: {
                    in:
                      uniquePermissionUuids,
                  },

                  type:
                    PermissionType.COMPANY,

                  status:
                    Status.ACTIVE,

                  deletedAt:
                    null,
                },

                select: {
                  id:
                    true,

                  uuid:
                    true,
                },
              })
            : [];

        const scopeByPermissionUuid =
          new Map<
            string,
            PermissionScope
          >();

        for (
          const assignment
          of assignments
        ) {
          scopeByPermissionUuid.set(
            assignment
              .permissionUuid,

            assignment
              .scope,
          );
        }

        await transaction.rolePermission.deleteMany({
          where: {
            roleId:
              role.id,
          },
        });

        if (
          permissions.length >
          0
        ) {
          await transaction.rolePermission.createMany({
            data:
              permissions.map(
                (
                  permission,
                ) => ({
                  roleId:
                    role.id,

                  permissionId:
                    permission.id,

                  scope:
                    scopeByPermissionUuid.get(
                      permission.uuid,
                    ) ??
                    PermissionScope.OWN,
                }),
              ),

            skipDuplicates:
              true,
          });
        }

        return {
          roleId:
            role.id,

          requestedPermissionCount:
            uniquePermissionUuids
              .length,

          assignedPermissionCount:
            permissions.length,

          assignedPermissions:
            permissions.map(
              (
                permission,
              ) => ({
                permissionUuid:
                  permission.uuid,

                scope:
                  scopeByPermissionUuid.get(
                    permission.uuid,
                  ) ??
                  PermissionScope.OWN,
              }),
            ),
        };
      },
    );
  }

  async countUsers(
    companyId: bigint,
    roleUuid: string,
  ) {
    return this.prisma.user.count({
      where: {
        companyId,

        role: {
          uuid:
            roleUuid,

          deletedAt:
            null,
        },

        deletedAt:
          null,
      },
    });
  }
}