import {
  Injectable,
} from "@nestjs/common";

import {
  OrganizationUnit,
  Prisma,
} from "@prisma/client";

import {
  PrismaService,
} from "src/database/prisma.service";

@Injectable()
export class OrganizationUnitRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private readonly include = {
    company: {
      select: {
        uuid: true,
        name: true,
        code: true,
      },
    },

    parent: {
      select: {
        uuid: true,
        name: true,
        code: true,
        type: true,
      },
    },

    state: {
      select: {
        uuid: true,
        name: true,
      },
    },

    city: {
      select: {
        uuid: true,
        name: true,
        stateId: true,
      },
    },
  } satisfies Prisma.OrganizationUnitInclude;

  async create(
    data:
      Prisma.OrganizationUnitCreateInput,
  ) {
    return this.prisma.organizationUnit.create({
      data,

      include:
        this.include,
    });
  }

  async findAll(
    companyId: bigint,
  ) {
    return this.prisma.organizationUnit.findMany({
      where: {
        companyId,

        deletedAt:
          null,
      },

      include:
        this.include,

      orderBy: {
        createdAt:
          "desc",
      },
    });
  }

  async findById(
    companyId: bigint,
    id: bigint,
  ) {
    return this.prisma.organizationUnit.findFirst({
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
    return this.prisma.organizationUnit.findFirst({
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

  async findChildren(
    companyId: bigint,
    parentId: bigint,
  ) {
    return this.prisma.organizationUnit.findMany({
      where: {
        companyId,
        parentId,

        deletedAt:
          null,
      },

      include:
        this.include,

      orderBy: {
        name:
          "asc",
      },
    });
  }

  async findParentById(
    companyId: bigint,
    id: bigint,
  ) {
    return this.prisma.organizationUnit.findFirst({
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

  async findByCode(
    companyId: bigint,
    code: string,
  ) {
    return this.prisma.organizationUnit.findFirst({
      where: {
        companyId,
        code,

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  async findByName(
    companyId: bigint,
    name: string,
  ) {
    return this.prisma.organizationUnit.findFirst({
      where: {
        companyId,
        name,

        deletedAt:
          null,
      },

      include:
        this.include,
    });
  }

  async findAllByCompany(
    companyId: bigint,
  ): Promise<OrganizationUnit[]> {
    return this.prisma.organizationUnit.findMany({
      where: {
        companyId,

        deletedAt:
          null,
      },

      orderBy: [
        {
          type:
            "asc",
        },
        {
          name:
            "asc",
        },
      ],
    });
  }

  async update(
    companyId: bigint,
    uuid: string,
    data:
      Prisma.OrganizationUnitUpdateInput,
  ) {
    /*
     * Prisma update() uuid only se tenant
     * boundary enforce nahi kar sakta.
     *
     * Pehle same-company record resolve karo.
     */
    const unit =
      await this.prisma.organizationUnit.findFirst({
        where: {
          uuid,
          companyId,

          deletedAt:
            null,
        },

        select: {
          id:
            true,
        },
      });

    if (!unit) {
      return null;
    }

    return this.prisma.organizationUnit.update({
      where: {
        id:
          unit.id,
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
    const unit =
      await this.prisma.organizationUnit.findFirst({
        where: {
          uuid,
          companyId,

          deletedAt:
            null,
        },

        select: {
          id:
            true,
        },
      });

    if (!unit) {
      return null;
    }

    return this.prisma.organizationUnit.update({
      where: {
        id:
          unit.id,
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