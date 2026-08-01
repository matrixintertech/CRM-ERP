import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  OrganizationUnit,
  Prisma,
} from "@prisma/client";

import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class OrganizationUnitRepository {
  constructor(
    private readonly prisma: PrismaService,
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
    },
  },
} satisfies Prisma.OrganizationUnitInclude;

  async create(
    data: Prisma.OrganizationUnitCreateInput,
  ) {
    return this.prisma.organizationUnit.create({
      data,
      include: this.include,
    });
  }

  async findAll(
    companyId: bigint | null,
  ) {
    return this.prisma.organizationUnit.findMany({
      where: {
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },

      include: this.include,

      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }

  async findById(
    companyId: bigint | null,
    id: bigint,
  ) {
    return this.prisma.organizationUnit.findFirst({
      where: {
        id,
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },

      include: this.include,
    });
  }

  async findByUuid(
    companyId: bigint | null,
    uuid: string,
  ) {
    return this.prisma.organizationUnit.findFirst({
      where: {
        uuid,
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },

      include: this.include,
    });
  }

  async findChildren(
    companyId: bigint | null,
    parentId: bigint,
  ) {
    return this.prisma.organizationUnit.findMany({
      where: {
        parentId,
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },

      include: this.include,

      orderBy: {
        name: "asc",
      },
    });
  }

  async findParentById(
    companyId: bigint | null,
    id: bigint,
  ) {
    return this.prisma.organizationUnit.findFirst({
      where: {
        id,
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),
      },

      include: this.include,
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
        deletedAt: null,
      },

      include: this.include,
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
        deletedAt: null,
      },

      include: this.include,
    });
  }

  async findAllByCompany(
    companyId: bigint,
  ): Promise<OrganizationUnit[]> {
    return this.prisma.organizationUnit.findMany({
      where: {
        companyId,
        deletedAt: null,
      },

      orderBy: [
        {
          type: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }

  async update(
    companyId: bigint | null,
    uuid: string,
    data: Prisma.OrganizationUnitUpdateInput,
  ) {
    const unit =
      await this.prisma.organizationUnit.findFirst({
        where: {
          uuid,
          deletedAt: null,

          ...(companyId !== null && {
            companyId,
          }),
        },

        select: {
          id: true,
        },
      });

    if (!unit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    return this.prisma.organizationUnit.update({
      where: {
        id: unit.id,
      },

      data,

      include: this.include,
    });
  }

  async delete(
    companyId: bigint | null,
    uuid: string,
  ) {
    const unit =
      await this.prisma.organizationUnit.findFirst({
        where: {
          uuid,
          deletedAt: null,

          ...(companyId !== null && {
            companyId,
          }),
        },

        select: {
          id: true,
        },
      });

    if (!unit) {
      throw new NotFoundException(
        "Organization unit not found.",
      );
    }

    return this.prisma.organizationUnit.update({
      where: {
        id: unit.id,
      },

      data: {
        deletedAt: new Date(),
      },

      include: this.include,
    });
  }

  async findCompanyById(
    id: bigint,
  ) {
    return this.prisma.company.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findCompanyByUuid(
    uuid: string,
  ) {
    return this.prisma.company.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    });
  }







}