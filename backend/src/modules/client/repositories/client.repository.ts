import { Injectable } from '@nestjs/common';
import { Prisma, Status } from '@prisma/client';

import { PrismaService } from 'src/database/prisma.service';

import { ClientDropdownDto, ClientQueryDto } from '../dto';
import { IClientRepository } from '../interfaces';

export type ClientWithRelations = Prisma.ClientGetPayload<{
  include: {
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
export class ClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
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
    companyId: bigint,
    query: ClientQueryDto,
  ): Promise<{
    clients: ClientWithRelations[];
    total: number;
  }> {
    const { page = 1, limit = 10, search, status } = query;

    const where: Prisma.ClientWhereInput = {
      companyId,
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            contactName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            mobile: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const [clients, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        include: this.include,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
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
    companyId: bigint,
    query: ClientDropdownDto,
  ): Promise<
    {
      uuid: string;
      name: string;
    }[]
  > {
    return this.prisma.client.findMany({
      where: {
        companyId,
        deletedAt: null,
        status: query.status ?? Status.ACTIVE,
      },
      select: {
        uuid: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByUuid(
    companyId: bigint,
    uuid: string,
  ): Promise<ClientWithRelations | null> {
    return this.prisma.client.findFirst({
      where: {
        companyId,
        uuid,
        deletedAt: null,
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
    companyId: bigint,
    uuid: string,
    data: Prisma.ClientUncheckedUpdateInput,
  ): Promise<ClientWithRelations> {
    return this.prisma.client.update({
      where: {
        uuid,
      },
      data,
      include: this.include,
    });
  }

  async softDelete(
    companyId: bigint,
    uuid: string,
  ): Promise<ClientWithRelations> {
    return this.prisma.client.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: new Date(),
      },
      include: this.include,
    });
  }
}