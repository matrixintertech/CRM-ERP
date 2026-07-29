import { Injectable } from "@nestjs/common";
import { Prisma, State } from "@prisma/client";

import { PrismaService } from "src/database/prisma.service";

import {
  CreateStateDto,
  StateDropdownDto,
  StateQueryDto,
  UpdateStateDto,
} from "../dto";

import { IStateRepository } from "../interfaces/state.interface";

@Injectable()
export class StateRepository
  implements IStateRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateStateDto,
  ): Promise<State> {
    return this.prisma.state.create({
      data: {
        name: dto.name,
        code: dto.code,
        gstCode: dto.gstCode,
        status: dto.status,
      },
    });
  }

  async findAll(
    query: StateQueryDto,
  ): Promise<{
    data: State[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
    } = query;

    const where: Prisma.StateWhereInput = {
      deletedAt: null,

      ...(status && {
        status,
      }),

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [data, total] =
      await this.prisma.$transaction([
        this.prisma.state.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            name: "asc",
          },
        }),

        this.prisma.state.count({
          where,
        }),
      ]);

    return {
      data,
      total,
    };
  }

  async findDropdown(
    query: StateDropdownDto,
  ): Promise<Partial<State>[]> {
    return this.prisma.state.findMany({
      where: {
        deletedAt: null,

        ...(query.status && {
          status: query.status,
        }),
      },

      select: {
        uuid: true,
        name: true,
        code: true,
      },

      orderBy: {
        name: "asc",
      },
    });
  }

  async findByUuid(
    uuid: string,
  ): Promise<State | null> {
    return this.prisma.state.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    });
  }

  async findByName(
    name: string,
  ): Promise<State | null> {
    return this.prisma.state.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        deletedAt: null,
      },
    });
  }

  async findByCode(
    code: string,
  ): Promise<State | null> {
    return this.prisma.state.findFirst({
      where: {
        code: {
          equals: code,
          mode: "insensitive",
        },
        deletedAt: null,
      },
    });
  }

  async update(
    uuid: string,
    dto: UpdateStateDto,
  ): Promise<State> {
    return this.prisma.state.update({
      where: {
        uuid,
      },

      data: {
        ...dto,
      },
    });
  }

  async softDelete(
    uuid: string,
  ): Promise<State> {
    return this.prisma.state.update({
      where: {
        uuid,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }
}