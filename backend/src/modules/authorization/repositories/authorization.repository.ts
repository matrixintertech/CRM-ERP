import {
  Injectable,
} from "@nestjs/common";

import {
  PermissionType,
  Status,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

@Injectable()
export class AuthorizationRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly permissionSelect = {
    id: true,
    uuid: true,

    module: true,

    name: true,

    code: true,

    description: true,

    type: true,

    status: true,
  } as const;

  /*
   * Current authenticated user ka
   * basic authorization context.
   *
   * JwtStrategy already user validate
   * karta hai, but authorization guard
   * ke time current role assignments
   * DB se resolve honge.
   */
  async findUserContext(
    userId: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        id:
          userId,

        deletedAt:
          null,
      },

      select: {
        id: true,

        uuid: true,

        userType: true,

        status: true,

        companyId: true,

        employeeId: true,

        roleId: true,

        platformRoleId: true,
      },
    });
  }

  /*
   * PLATFORM permissions.
   *
   * Only:
   * PermissionType.PLATFORM
   * ACTIVE
   * non-deleted
   *
   * PlatformRolePermission me
   * PermissionScope nahi hota.
   */
  async findPlatformPermissions(
    userId: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        id:
          userId,

        deletedAt:
          null,
      },

      select: {
        id: true,

        uuid: true,

        userType: true,

        platformRoleId:
          true,

        platformRole: {
          select: {
            id: true,

            uuid: true,

            name: true,

            code: true,

            status: true,

            deletedAt:
              true,

            permissions: {
              where: {
                permission: {
                  type:
                    PermissionType.PLATFORM,

                  status:
                    Status.ACTIVE,

                  deletedAt:
                    null,
                },
              },

              select: {
                permissionId:
                  true,

                permission: {
                  select:
                    this.permissionSelect,
                },
              },
            },
          },
        },
      },
    });
  }

  /*
   * COMPANY permissions.
   *
   * RolePermission:
   * permission + scope
   *
   * UserPermission:
   * permission + scope
   */
  async findCompanyPermissions(
    userId: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        id:
          userId,

        deletedAt:
          null,
      },

      select: {
        id: true,

        uuid: true,

        userType: true,

        companyId:
          true,

        employeeId:
          true,

        roleId:
          true,

        role: {
          select: {
            id: true,

            uuid: true,

            name: true,

            code: true,

            status: true,

            deletedAt:
              true,

            rolePermissions: {
              where: {
                permission: {
                  type:
                    PermissionType.COMPANY,

                  status:
                    Status.ACTIVE,

                  deletedAt:
                    null,
                },
              },

              select: {
                permissionId:
                  true,

                scope:
                  true,

                permission: {
                  select:
                    this.permissionSelect,
                },
              },
            },
          },
        },

        extraPermissions: {
          where: {
            permission: {
              type:
                PermissionType.COMPANY,

              status:
                Status.ACTIVE,

              deletedAt:
                null,
            },
          },

          select: {
            permissionId:
              true,

            scope:
              true,

            permission: {
              select:
                this.permissionSelect,
            },
          },
        },
      },
    });
  }
}