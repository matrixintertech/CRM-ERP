import {
  Injectable,
} from "@nestjs/common";

import {
  PermissionScope,
  PermissionType,
  Prisma,
  Status,
  UserStatus,
  UserType,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

export interface UserListQuery {
  page?: number;
  limit?: number;

  search?: string;

  status?: UserStatus;
  userType?: UserType;

  roleId?: bigint;

  sortBy?:
    | "name"
    | "email"
    | "status"
    | "userType"
    | "createdAt";

  sortOrder?:
    | "asc"
    | "desc";
}

export interface UserPermissionAssignment {
  permissionId: bigint;

  scope: PermissionScope;
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
    type: true,
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
    query: UserListQuery = {},
  ) {
    const page =
      Math.max(
        1,
        query.page ?? 1,
      );

    const limit =
      Math.min(
        Math.max(
          1,
          query.limit ?? 10,
        ),
        100,
      );

    const skip =
      (page - 1) *
      limit;

    const normalizedSearch =
      query.search
        ?.trim();

    const sortBy =
      query.sortBy ??
      "createdAt";

    const sortOrder:
      Prisma.SortOrder =
        query.sortOrder ??
        "desc";

    const where:
      Prisma.UserWhereInput = {
        deletedAt:
          null,

        ...(companyId !==
          null && {
          companyId,
        }),

        ...(query.status !==
          undefined && {
          status:
            query.status,
        }),

        ...(query.userType !==
          undefined && {
          userType:
            query.userType,
        }),

        ...(query.roleId !==
          undefined && {
          roleId:
            query.roleId,
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

    let orderBy:
      Prisma.UserOrderByWithRelationInput;

    switch (
      sortBy
    ) {
      case "name":
        orderBy = {
          displayName:
            sortOrder,
        };
        break;

      case "email":
        orderBy = {
          email:
            sortOrder,
        };
        break;

      case "status":
        orderBy = {
          status:
            sortOrder,
        };
        break;

      case "userType":
        orderBy = {
          userType:
            sortOrder,
        };
        break;

      case "createdAt":
      default:
        orderBy = {
          createdAt:
            sortOrder,
        };
        break;
    }

    const [
      users,
      total,
    ] =
      await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,

          include:
            this.userInclude,

          skip,

          take:
            limit,

          orderBy,
        }),

        this.prisma.user.count({
          where,
        }),
      ]);

    return {
      users,

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

  async findById(
    id: bigint,
  ) {
    return this.prisma.user.findFirst({
      where: {
        id,

        deletedAt:
          null,
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

        deletedAt:
          null,

        ...(companyId !==
          null && {
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

        deletedAt:
          null,
      },
    });
  }

  async findByMobile(
    mobile: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        mobile,

        deletedAt:
          null,
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

        deletedAt:
          null,
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

        deletedAt:
          null,

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

        deletedAt:
          null,

        ...(companyId !==
          null && {
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
                  type:
                    PermissionType.COMPANY,

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
              type:
                PermissionType.COMPANY,

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
      permissionUuids.length ===
      0
    ) {
      return [];
    }

    return this.prisma.permission.findMany({
      where: {
        uuid: {
          in:
            permissionUuids,
        },

        type:
          PermissionType.COMPANY,

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
    assignments:
      UserPermissionAssignment[],
  ) {
    return this.prisma.$transaction(
      async (
        tx,
      ) => {
        await tx.userPermission.deleteMany({
          where: {
            userId,
          },
        });

        if (
          assignments.length >
          0
        ) {
          await tx.userPermission.createMany({
            data:
              assignments.map(
                (
                  assignment,
                ) => ({
                  userId,

                  permissionId:
                    assignment.permissionId,

                  scope:
                    assignment.scope,
                }),
              ),

            skipDuplicates:
              true,
          });
        }

        return tx.userPermission.findMany({
          where: {
            userId,

            permission: {
              type:
                PermissionType.COMPANY,

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
      },
    );
  }

  async update(
    id: bigint,
    data:
      Prisma.UserUpdateInput,
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