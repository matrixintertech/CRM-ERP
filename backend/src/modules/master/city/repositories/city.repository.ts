import { Injectable } from "@nestjs/common";
import {
  City,
  Prisma,
  State,
} from "@prisma/client";

import { PrismaService } from "src/database/prisma.service";

import {
  CityDropdownDto,
  CityQueryDto,
  CreateCityDto,
  UpdateCityDto,
} from "../dto";

import {
  CityWithState,
  ICityRepository,
} from "../interfaces/city.interface";

@Injectable()
export class CityRepository
  implements ICityRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateCityDto,
  ): Promise<City> {
    const state =
      await this.prisma.state.findFirst({
        where: {
          uuid: dto.stateUuid,
          deletedAt: null,
        },
      });

    return this.prisma.city.create({
      data: {
        stateId: state!.id,
        name: dto.name,
        status: dto.status,
      },
    });
  }

  async findAll(
    query: CityQueryDto,
  ): Promise<{
    data: CityWithState[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      stateUuid,
    } = query;

    const where: Prisma.CityWhereInput = {
      deletedAt: null,

      ...(status && {
        status,
      }),

      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    if (stateUuid) {
      const state =
        await this.prisma.state.findFirst({
          where: {
            uuid: stateUuid,
            deletedAt: null,
          },
        });

      where.stateId = state?.id;
    }

    const [data, total] =
      await this.prisma.$transaction([
        this.prisma.city.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,

          include: {
            state: {
              select: {
                uuid: true,
                name: true,
              },
            },
          },

          orderBy: {
            name: "asc",
          },
        }),

        this.prisma.city.count({
          where,
        }),
      ]);

    return {
      data,
      total,
    };
  }

  async findDropdown(
    query: CityDropdownDto,
  ): Promise<
    {
      uuid: string;
      name: string;
    }[]
  > {
    const where: Prisma.CityWhereInput = {
      deletedAt: null,

      ...(query.status && {
        status: query.status,
      }),
    };

    if (query.stateUuid) {
      const state =
        await this.prisma.state.findFirst({
          where: {
            uuid: query.stateUuid,
            deletedAt: null,
          },
        });

      where.stateId = state?.id;
    }

    return this.prisma.city.findMany({
      where,

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
    uuid: string,
  ): Promise<CityWithState | null> {
    return this.prisma.city.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },

      include: {
        state: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });
  }

  async findByName(
    name: string,
    stateUuid: string,
  ): Promise<City | null> {
    const state =
      await this.prisma.state.findFirst({
        where: {
          uuid: stateUuid,
          deletedAt: null,
        },
      });

    if (!state) {
      return null;
    }

    return this.prisma.city.findFirst({
      where: {
        stateId: state.id,

        name: {
          equals: name,
          mode: "insensitive",
        },

        deletedAt: null,
      },
    });
  }

  async update(
    uuid: string,
    dto: UpdateCityDto,
  ): Promise<City> {
    const data: Prisma.CityUpdateInput =
      {
        name: dto.name,
        status: dto.status,
      };

    if (dto.stateUuid) {
      const state =
        await this.prisma.state.findFirst({
          where: {
            uuid: dto.stateUuid,
            deletedAt: null,
          },
        });

      if (state) {
        data.state = {
          connect: {
            id: state.id,
          },
        };
      }
    }

    return this.prisma.city.update({
      where: {
        uuid,
      },
      data,
    });
  }

  async softDelete(
    uuid: string,
  ): Promise<City> {
    return this.prisma.city.update({
      where: {
        uuid,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }
}