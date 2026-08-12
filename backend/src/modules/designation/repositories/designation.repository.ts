import {
  Injectable,
} from '@nestjs/common';

import {
  Prisma,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

export interface DesignationAccessBoundary {
  companyId: bigint;

  /*
   * null:
   *   COMPANY scope.
   *
   * bigint[]:
   *   ORGANIZATION_UNIT scope.
   *
   * []:
   *   no accessible organization units.
   */
  organizationUnitIds:
    bigint[] | null;
}

@Injectable()
export class DesignationRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly include = {
    department: {
      select: {
        id: true,
        uuid: true,
        name: true,
        code: true,

        organizationUnit: {
          select: {
            id: true,
            uuid: true,
            name: true,
            code: true,
            type: true,
          },
        },
      },
    },
  } satisfies Prisma.DesignationInclude;

  private buildAccessWhere(
    access:
      DesignationAccessBoundary,
  ): Prisma.DesignationWhereInput {
    return {
      companyId:
        access.companyId,

      deletedAt:
        null,

      ...(access.organizationUnitIds !==
        null && {
        department: {
          is: {
            organizationUnitId: {
              in:
                access.organizationUnitIds,
            },

            deletedAt:
              null,
          },
        },
      }),
    };
  }

  async create(
    data:
      Prisma.DesignationCreateInput,
  ) {
    return this.prisma.designation.create({
      data,

      include:
        this.include,
    });
  }

  async findAll(
    access:
      DesignationAccessBoundary,
  ) {
    return this.prisma.designation.findMany({
      where:
        this.buildAccessWhere(
          access,
        ),

      include:
        this.include,

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async findById(
    access:
      DesignationAccessBoundary,
    id: bigint,
  ) {
    return this.prisma.designation.findFirst({
      where: {
        ...this.buildAccessWhere(
          access,
        ),

        id,
      },

      include:
        this.include,
    });
  }

  async findByUuid(
    access:
      DesignationAccessBoundary,
    uuid: string,
  ) {
    return this.prisma.designation.findFirst({
      where: {
        ...this.buildAccessWhere(
          access,
        ),

        uuid,
      },

      include:
        this.include,
    });
  }

  /*
   * Internal business validation ke liye.
   *
   * Example:
   * EmployeeService ko designation validate
   * karna ho after company boundary is already
   * resolved.
   */
  async findByUuidInCompany(
    companyId: bigint,
    uuid: string,
  ) {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        uuid,

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  async findByName(
    companyId: bigint,
    departmentId: bigint,
    name: string,
  ) {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        departmentId,
        name,

        deletedAt:
          null,
      },
    });
  }

  async findByCode(
    companyId: bigint,
    departmentId: bigint,
    code: string,
  ) {
    return this.prisma.designation.findFirst({
      where: {
        companyId,
        departmentId,
        code,

        deletedAt:
          null,
      },
    });
  }

  async update(
    access:
      DesignationAccessBoundary,
    id: bigint,
    data:
      Prisma.DesignationUpdateInput,
  ) {
    const designation =
      await this.prisma.designation.findFirst({
        where: {
          ...this.buildAccessWhere(
            access,
          ),

          id,
        },

        select: {
          id: true,
        },
      });

    if (!designation) {
      return null;
    }

    return this.prisma.designation.update({
      where: {
        id:
          designation.id,
      },

      data,

      include:
        this.include,
    });
  }

  async softDelete(
    access:
      DesignationAccessBoundary,
    id: bigint,
  ) {
    const designation =
      await this.prisma.designation.findFirst({
        where: {
          ...this.buildAccessWhere(
            access,
          ),

          id,
        },

        select: {
          id: true,
        },
      });

    if (!designation) {
      return null;
    }

    return this.prisma.designation.update({
      where: {
        id:
          designation.id,
      },

      data: {
        deletedAt:
          new Date(),
      },

      include:
        this.include,
    });
  }
}