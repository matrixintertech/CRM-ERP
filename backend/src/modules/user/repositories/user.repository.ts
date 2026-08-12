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

export interface UserAccessBoundary {
  companyId: bigint;

  /*
   * true = COMPANY scope.
   *
   * false = access directUserIds /
   * organizationUnitIds se resolve hoga.
   */
  companyAccess: boolean;

  /*
   * OWN / TEAM scope se resolved users.
   *
   * OWN:
   * [currentUserId]
   *
   * TEAM:
   * [team user IDs]
   */
  directUserIds: bigint[];

  /*
   * ORGANIZATION_UNIT scope.
   */
  organizationUnitIds: bigint[];
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

        organizationUnitId: true,

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

    /*
     * Direct permission assignment ke
     * waqt requested scope validate
     * karne ke liye required.
     */
    allowedScopes: true,
  } satisfies Prisma.PermissionSelect;

  /*
   * Authorization boundary.
   *
   * Always company hard-filtered.
   *
   * COMPANY:
   * companyAccess = true
   *
   * OWN / TEAM:
   * directUserIds
   *
   * ORGANIZATION_UNIT:
   * employee.organizationUnitId
   */
  private buildAccessWhere(
    access: UserAccessBoundary,
  ): Prisma.UserWhereInput {
    const baseWhere:
      Prisma.UserWhereInput = {
      companyId:
        access.companyId,

      deletedAt:
        null,
    };

    /*
     * COMPANY scope means all users
     * inside current tenant.
     */
    if (
      access.companyAccess
    ) {
      return baseWhere;
    }

    const accessOr:
      Prisma.UserWhereInput[] = [];

    /*
     * OWN / TEAM
     */
    if (
      access.directUserIds.length >
      0
    ) {
      accessOr.push({
        id: {
          in:
            access.directUserIds,
        },
      });
    }

    /*
     * ORGANIZATION_UNIT
     *
     * User
     *   -> Employee
     *      -> organizationUnitId
     */
    if (
      access.organizationUnitIds.length >
      0
    ) {
      accessOr.push({
        employee: {
          is: {
            organizationUnitId: {
              in:
                access.organizationUnitIds,
            },

            deletedAt:
              null,
          },
        },
      });
    }

    /*
     * Permission exists but no
     * effective resource boundary.
     *
     * Fail closed.
     */
    if (
      accessOr.length ===
      0
    ) {
      return {
        ...baseWhere,

        id: {
          in: [],
        },
      };
    }

    return {
      ...baseWhere,

      OR:
        accessOr,
    };
  }

  async create(
    data:
      Prisma.UserCreateInput,

    tx?:
      Prisma.TransactionClient,
  ) {
    return (
      tx ??
      this.prisma
    ).user.create({
      data,

      include:
        this.userInclude,
    });
  }

  /*
   * Authorization-aware user listing.
   */
  async findAll(
    access:
      UserAccessBoundary,

    query:
      UserListQuery = {},
  ) {
    const page =
      Math.max(
        1,
        query.page ??
          1,
      );

    const limit =
      Math.min(
        Math.max(
          1,
          query.limit ??
            10,
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

    /*
     * IMPORTANT:
     *
     * Access filter bhi OR use karta hai
     * aur search bhi OR use karta hai.
     *
     * Isliye spread karke OR overwrite
     * nahi karna.
     *
     * AND:
     *   access boundary
     *   filters
     *   search OR
     */
    const andWhere:
      Prisma.UserWhereInput[] = [
        this.buildAccessWhere(
          access,
        ),
      ];

    const filters:
      Prisma.UserWhereInput = {
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
    };

    andWhere.push(
      filters,
    );

    if (
      normalizedSearch
    ) {
      andWhere.push({
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
      });
    }

    const where:
      Prisma.UserWhereInput = {
      AND:
        andWhere,
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

  /*
   * INTERNAL LOOKUP.
   *
   * Auth/profile/JWT flow ke liye.
   *
   * Company management authorization
   * ke liye use mat karna.
   */
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

  /*
   * Authorization-aware lookup.
   */
  async findByUuid(
    access:
      UserAccessBoundary,

    uuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        ...this.buildAccessWhere(
          access,
        ),

        uuid,
      },

      include:
        this.userInclude,
    });
  }

  /*
   * Internal same-company validation.
   *
   * Example:
   * relation/business validation after
   * company boundary already resolved.
   */
  async findByUuidInCompany(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        companyId,
        uuid,

        deletedAt:
          null,
      },

      include:
        this.userInclude,
    });
  }

  /*
   * Auth/internal uniqueness lookup.
   */
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

  /*
   * Auth/internal uniqueness lookup.
   */
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

  /*
   * Internal same-company employee
   * relation lookup.
   */
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

  /*
   * Authorization-aware employee
   * user account lookup.
   */
  async findByEmployeeUuid(
    access:
      UserAccessBoundary,

    employeeUuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        ...this.buildAccessWhere(
          access,
        ),

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

  /*
   * Internal same-company employee
   * user lookup.
   */
  async findByEmployeeUuidInCompany(
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

  /*
   * Authorization-aware user +
   * role/direct permissions lookup.
   *
   * user_permission.view/update route
   * ke liye service appropriate
   * UserAccessBoundary pass karegi.
   */
  async findUserWithPermissions(
    access:
      UserAccessBoundary,

    uuid: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        ...this.buildAccessWhere(
          access,
        ),

        uuid,
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

            organizationUnitId:
              true,

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

  /*
   * Permission assignment validation.
   *
   * COMPANY permissions only.
   * allowedScopes permissionSelect se
   * available honge.
   */
  async findActivePermissionsByUuids(
    permissionUuids:
      string[],
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

  /*
   * Direct UserPermission =
   * additional grants.
   *
   * Empty assignments remove all
   * direct additional permissions.
   */
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

  /*
   * Authorization-aware update.
   *
   * First scoped resource resolve,
   * then update by internal ID.
   */
  async update(
    access:
      UserAccessBoundary,

    id: bigint,

    data:
      Prisma.UserUpdateInput,
  ) {
    const user =
      await this.prisma.user.findFirst({
        where: {
          ...this.buildAccessWhere(
            access,
          ),

          id,
        },

        select: {
          id:
            true,
        },
      });

    if (!user) {
      return null;
    }

    return this.prisma.user.update({
      where: {
        id:
          user.id,
      },

      data,

      include:
        this.userInclude,
    });
  }

  /*
   * Authorization-aware soft delete.
   */
  async softDelete(
    access:
      UserAccessBoundary,

    id: bigint,
  ) {
    const user =
      await this.prisma.user.findFirst({
        where: {
          ...this.buildAccessWhere(
            access,
          ),

          id,
        },

        select: {
          id:
            true,
        },
      });

    if (!user) {
      return null;
    }

    return this.prisma.user.update({
      where: {
        id:
          user.id,
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

  /*
   * Internal company bootstrap lookup.
   *
   * UserType is category only;
   * authorization bypass nahi.
   */
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