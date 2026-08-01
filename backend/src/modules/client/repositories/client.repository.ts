import { Injectable } from "@nestjs/common";

import {
  Prisma,
  Status,
} from "@prisma/client";

import { PrismaService } from "src/database/prisma.service";

import {
  ClientDropdownDto,
  ClientQueryDto,
} from "../dto";

import { IClientRepository } from "../interfaces";

export type ClientWithRelations =
  Prisma.ClientGetPayload<{
    include: {
      company: {
        select: {
          uuid: true;
          name: true;
          code: true;
        };
      };

      state: {
        select: {
          uuid: true;
          name: true;
        };
      };

      city: {
        select: {
          uuid: true;
          name: true;
        };
      };
    };
  }>;

@Injectable()
export class ClientRepository
  implements IClientRepository
{
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
  } satisfies Prisma.ClientInclude;

  async create(
    data: Prisma.ClientUncheckedCreateInput,
  ): Promise<ClientWithRelations> {
    return this.prisma.client.create({
      data,
      include: this.include,
    });
  }

  async findAll(
    companyId: bigint | null,
    query: ClientQueryDto,
  ): Promise<{
    clients: ClientWithRelations[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
    } = query;

    const normalizedSearch =
      search?.trim();

    const where: Prisma.ClientWhereInput = {
      deletedAt: null,

      /*
       * PLATFORM_OWNER:
       * companyId null hoga, isliye filter nahi lagega.
       *
       * COMPANY_ADMIN / EMPLOYEE:
       * companyId available hoga, sirf us company ke clients aayenge.
       */
      ...(companyId !== null && {
        companyId,
      }),

      ...(status && {
        status,
      }),

      ...(normalizedSearch && {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            contactName: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            mobile: {
              contains: normalizedSearch,
            },
          },
          {
            email: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [clients, total] =
      await this.prisma.$transaction([
        this.prisma.client.findMany({
          where,
          include: this.include,

          skip: (page - 1) * limit,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        this.prisma.client.count({
          where,
        }),
      ]);

    return {
      clients,
      total,
    };
  }

  async findDropdown(
    companyId: bigint | null,
    query: ClientDropdownDto,
  ): Promise<
    {
      uuid: string;
      name: string;
    }[]
  > {
    return this.prisma.client.findMany({
      where: {
        deletedAt: null,

        ...(companyId !== null && {
          companyId,
        }),

        status:
          query.status ??
          Status.ACTIVE,
      },

      select: {
        uuid: true,
        name: true,
      },

      orderBy: {
        name: "asc",
      },
    });
  }

  async findByUuid(
    companyId: bigint | null,
    uuid: string,
  ): Promise<ClientWithRelations | null> {
    return this.prisma.client.findFirst({
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




  async findByCode(
    companyId: bigint,
    code: string,
  ): Promise<ClientWithRelations | null> {
    return this.prisma.client.findFirst({
      where: {
        companyId,
        code,
        deletedAt: null,
      },

      include: this.include,
    });
  }

  async update(
    companyId: bigint | null,
    uuid: string,
    data: Prisma.ClientUncheckedUpdateInput,
  ): Promise<ClientWithRelations> {
    const client =
      await this.prisma.client.findFirst({
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

    if (!client) {
      throw new Error(
        "Client not found.",
      );
    }

    return this.prisma.client.update({
      where: {
        id: client.id,
      },

      data,

      include: this.include,
    });
  }

  async softDelete(
    companyId: bigint | null,
    uuid: string,
  ): Promise<ClientWithRelations> {
    const client =
      await this.prisma.client.findFirst({
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

    if (!client) {
      throw new Error(
        "Client not found.",
      );
    }

    return this.prisma.client.update({
      where: {
        id: client.id,
      },

      data: {
        deletedAt: new Date(),
      },

      include: this.include,
    });
  }


}