import {
  Injectable,
} from "@nestjs/common";

import {
  Prisma,
  Status,
  UserStatus,
  UserType,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  userType?: UserType;
  roleId?: bigint;
}

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly userInclude = {
    company: {
      select: {
        uuid: true,
        name: true,
        code: true,
      },
    },

    role: {
      select: {
        uuid: true,
        name: true,
        code: true,
        status: true,
      },
    },

    employee: {
      select: {
        uuid: true,
        employeeCode: true,

        firstName: true,
        lastName: true,
        displayName: true,

        email: true,
        mobile: true,
        avatarUrl: true,

        organizationUnit: {
          select: {
            uuid: true,
            name: true,
            code: true,
            type: true,
          },
        },

        department: {
          select: {
            uuid: true,
            name: true,
            code: true,
          },
        },

        designation: {
          select: {
            uuid: true,
            name: true,
            code: true,
          },
        },
      },
    },
  } satisfies Prisma.UserInclude;

  private readonly permissionSelect = {
    id: true,
    uuid: true,
    module: true,
    name: true,
    code: true,
    description: true,
    status: true,
  } satisfies Prisma.PermissionSelect;

  async create(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (
      tx ?? this.prisma
    ).user.create({
      data,

      include:
        this.userInclude,
    });
  }

  async findAll(
    companyId: bigint | null,
    query: UserListQuery,
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      userType,
      roleId,
    } = query;

    const normalizedSearch =
      search?.trim();

    const where:
      Prisma.UserWhereInput = {
      deletedAt: null,

      ...(companyId !== null && {
        companyId,
      }),

      ...(status !== undefined && {
        status,
      }),

      ...(userType !== undefined && {
        userType,
      }),

      ...(roleId !== undefined && {
        roleId,
      }),

      ...(normalizedSearch && {
        OR: [
          {
            displayName: {
              contains:
                normalizedSearch,

              mode:
                "insensitive",
            },
          },

          {
            email: {
              contains:
                normalizedSearch,

              mode:
                "insensitive",
            },
          },

          {
            mobile: {
              contains:
                normalizedSearch,
            },
          },

          {
            employee: {
              is: {
                employeeCode: {
                  contains:
                    normalizedSearch,

                  mode:
                    "insensitive",
                },
              },
            },
          },

          {
            employee: {
              is: {
                displayName: {
                  contains:
                    normalizedSearch,

                  mode:
                    "insensitive",
                },
              },
            },
          },

          {
            role: {
              is: {
                name: {
                  contains:
                    normalizedSearch,

                  mode:
                    "insensitive",
                },
              },
            },
          },
        ],
      }),
    };

    const [
      users,
      total,
    ] =
      await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,

          include:
            this.userInclude,

          skip:
            (page - 1) *
            limit,

          take:
            limit,

          orderBy: {
            createdAt:
              "desc",
          },
        }),

        this.prisma.user.count({
          where,
        }),
      ]);

    return {
      users,
      total,
    };
  }

  async findById(
    id: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },

      include:
        this.userInclude,
    });
  }

  async findByUuid(
    companyId: bigint | null,
    uuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        uuid,
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },

      include:
        this.userInclude,
    });
  }

  async findByEmail(
    email: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async findByMobile(
    mobile: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        mobile,
        deletedAt: null,
      },
    });
  }

  async findByEmployee(
    companyId: bigint,
    employeeId: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,
        employeeId,
        deletedAt: null,
      },

      include:
        this.userInclude,
    });
  }

  async findByEmployeeUuid(
    companyId: bigint,
    employeeUuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,
        deletedAt: null,

        employee: {
          is: {
            uuid:
              employeeUuid,

            deletedAt:
              null,
          },
        },
      },

      include:
        this.userInclude,
    });
  }

  async findUserWithPermissions(
    companyId: bigint | null,
    uuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        uuid,
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },

      include: {
        company: {
          select: {
            uuid: true,
            name: true,
            code: true,
          },
        },

        employee: {
          select: {
            uuid: true,
            employeeCode: true,
            displayName: true,

            firstName: true,
            lastName: true,

            organizationUnit: {
              select: {
                uuid: true,
                name: true,
                code: true,
              },
            },

            department: {
              select: {
                uuid: true,
                name: true,
                code: true,
              },
            },

            designation: {
              select: {
                uuid: true,
                name: true,
                code: true,
              },
            },
          },
        },

        role: {
          include: {
            rolePermissions: {
              where: {
                permission: {
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
            },
          },
        },

        extraPermissions: {
          where: {
            permission: {
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
        },
      },
    });
  }

  async findActivePermissionsByUuids(
    permissionUuids: string[],
  ) {
    if (
      permissionUuids.length === 0
    ) {
      return [];
    }

    return this.prisma.permission.findMany({
      where: {
        uuid: {
          in:
            permissionUuids,
        },

        status:
          Status.ACTIVE,

        deletedAt:
          null,
      },

      select:
        this.permissionSelect,
    });
  }

  async replaceUserPermissions(
    userId: bigint,
    permissionIds: bigint[],
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.userPermission.deleteMany({
          where: {
            userId,
          },
        });

        if (
          permissionIds.length > 0
        ) {
          await tx.userPermission.createMany({
            data:
              permissionIds.map(
                (
                  permissionId,
                ) => ({
                  userId,
                  permissionId,
                }),
              ),

            skipDuplicates:
              true,
          });
        }

        return tx.userPermission.findMany({
          where: {
            userId,
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
      },
    );
  }

  async update(
    id: bigint,
    data: Prisma.UserUpdateInput,
  ) {
    return this.prisma.user.update({
      where: {
        id,
      },

      data,

      include:
        this.userInclude,
    });
  }

  async softDelete(
    id: bigint,
  ) {
    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        status:
          UserStatus.INACTIVE,

        deletedAt:
          new Date(),
      },

      include:
        this.userInclude,
    });
  }

  async findCompanyAdmin(
    companyId: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,

        userType:
          UserType.COMPANY_ADMIN,

        deletedAt:
          null,
      },

      include:
        this.userInclude,
    });
  }
}