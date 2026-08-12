import {
  Injectable,
} from '@nestjs/common';

import {
  Prisma,
  Status,
} from '@prisma/client';

import {
  PrismaService,
} from 'src/database/prisma.service';

import {
  CreateDepartmentDto,
} from '../dto/create-department.dto';

export interface DepartmentAccessBoundary {
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
export class DepartmentRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private buildAccessWhere(
    access:
      DepartmentAccessBoundary,
  ): Prisma.DepartmentWhereInput {
    return {
      companyId:
        access.companyId,

      deletedAt:
        null,

      ...(access.organizationUnitIds !==
        null && {
        organizationUnitId: {
          in:
            access.organizationUnitIds,
        },
      }),
    };
  }

  async create(
    companyId: bigint,
    organizationUnitId: bigint,
    dto: CreateDepartmentDto,
  ) {
    return this.prisma.department.create({
      data: {
        companyId,
        organizationUnitId,

        name:
          dto.name,

        code:
          dto.code,

        description:
          dto.description,
      },

      include: {
        organizationUnit:
          true,
      },
    });
  }

  async findAll(
    access:
      DepartmentAccessBoundary,
  ) {
    return this.prisma.department.findMany({
      where:
        this.buildAccessWhere(
          access,
        ),

      include: {
        organizationUnit:
          true,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async findById(
    access:
      DepartmentAccessBoundary,
    id: bigint,
  ) {
    return this.prisma.department.findFirst({
      where: {
        ...this.buildAccessWhere(
          access,
        ),

        id,
      },

      include: {
        organizationUnit:
          true,
      },
    });
  }

  async findByUuid(
    access:
      DepartmentAccessBoundary,
    uuid: string,
  ) {
    return this.prisma.department.findFirst({
      where: {
        ...this.buildAccessWhere(
          access,
        ),

        uuid,
      },

      include: {
        organizationUnit:
          true,
      },
    });
  }

  /*
   * Duplicate checks resource-access scope
   * par nahi, actual tenant + OU boundary
   * par hone chahiye.
   */
  async findByName(
    companyId: bigint,
    organizationUnitId: bigint,
    name: string,
  ) {
    return this.prisma.department.findFirst({
      where: {
        companyId,
        organizationUnitId,
        name,

        deletedAt:
          null,
      },
    });
  }

  async findByCode(
    companyId: bigint,
    organizationUnitId: bigint,
    code: string,
  ) {
    return this.prisma.department.findFirst({
      where: {
        companyId,
        organizationUnitId,
        code,

        deletedAt:
          null,
      },
    });
  }

  async update(
    access:
      DepartmentAccessBoundary,
    id: bigint,
    data:
      Prisma.DepartmentUpdateInput,
  ) {
    const department =
      await this.prisma.department.findFirst({
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

    if (!department) {
      return null;
    }

    return this.prisma.department.update({
      where: {
        id:
          department.id,
      },

      data,

      include: {
        organizationUnit:
          true,
      },
    });
  }

  async softDelete(
    access:
      DepartmentAccessBoundary,
    id: bigint,
  ) {
    const department =
      await this.prisma.department.findFirst({
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

    if (!department) {
      return null;
    }

    return this.prisma.department.update({
      where: {
        id:
          department.id,
      },

      data: {
        deletedAt:
          new Date(),

        status:
          Status.INACTIVE,
      },

      include: {
        organizationUnit:
          true,
      },
    });
  }

  async findByUuidInCompany(
  companyId: bigint,
  uuid: string,
) {
  return this.prisma.department.findFirst({
    where: {
      companyId,
      uuid,
      deletedAt: null,
    },

    include: {
      organizationUnit: true,
    },
  });
}
}