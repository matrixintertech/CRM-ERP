import {
  BadRequestException,
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

            allowedScopes: true,

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

      /*
       * Same permission ek role me
       * sirf ek baar assign ho sakti hai.
       */
      const permissionUuids =
        assignments.map(
          (
            assignment,
          ) =>
            assignment.permissionUuid,
        );

      const uniquePermissionUuids = [
        ...new Set(
          permissionUuids,
        ),
      ];

      if (
        uniquePermissionUuids.length !==
        permissionUuids.length
      ) {
        throw new BadRequestException(
          'Duplicate permission assignments are not allowed.',
        );
      }

      /*
       * Sirf active COMPANY permissions
       * assign ki ja sakti hain.
       */
      const permissions =
        uniquePermissionUuids.length > 0
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

                code:
                  true,

                allowedScopes:
                  true,
              },
            })
          : [];

      /*
       * Important:
       * Invalid permission UUID hone par
       * existing role permissions delete
       * nahi honi chahiye.
       */
      if (
        permissions.length !==
        uniquePermissionUuids.length
      ) {
        throw new BadRequestException(
          'One or more permissions are invalid or inactive.',
        );
      }

      const permissionByUuid =
        new Map(
          permissions.map(
            (
              permission,
            ) => [
              permission.uuid,
              permission,
            ],
          ),
        );

      /*
       * Permission ke allowedScopes ke
       * against requested scope validate karo.
       */
      for (
        const assignment
        of assignments
      ) {
        const permission =
          permissionByUuid.get(
            assignment.permissionUuid,
          );

        if (!permission) {
          throw new BadRequestException(
            'Invalid permission assignment.',
          );
        }

        if (
          !permission.allowedScopes.includes(
            assignment.scope,
          )
        ) {
          throw new BadRequestException(
            `Scope ${assignment.scope} is not allowed for permission ${permission.code}.`,
          );
        }
      }

      /*
       * Validation complete hone ke baad
       * hi existing permissions replace karo.
       */
      await transaction.rolePermission.deleteMany({
        where: {
          roleId:
            role.id,
        },
      });

      if (
        assignments.length > 0
      ) {
        await transaction.rolePermission.createMany({
          data:
            assignments.map(
              (
                assignment,
              ) => {
                const permission =
                  permissionByUuid.get(
                    assignment.permissionUuid,
                  );

                if (!permission) {
                  throw new BadRequestException(
                    'Invalid permission assignment.',
                  );
                }

                return {
                  roleId:
                    role.id,

                  permissionId:
                    permission.id,

                  /*
                   * No default OWN.
                   * Scope explicitly supplied hai.
                   */
                  scope:
                    assignment.scope,
                };
              },
            ),

          skipDuplicates:
            true,
        });
      }

      return {
        roleId:
          role.id,

        requestedPermissionCount:
          assignments.length,

        assignedPermissionCount:
          assignments.length,

        assignedPermissions:
          assignments.map(
            (
              assignment,
            ) => ({
              permissionUuid:
                assignment.permissionUuid,

              scope:
                assignment.scope,
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