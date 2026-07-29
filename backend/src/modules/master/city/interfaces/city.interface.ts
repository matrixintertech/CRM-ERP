import {
  City,
  Prisma,
} from "@prisma/client";

import {
  CityDropdownDto,
  CityQueryDto,
  CreateCityDto,
  UpdateCityDto,
} from "../dto";

export type CityWithState =
  Prisma.CityGetPayload<{
    include: {
      state: {
        select: {
          uuid: true;
          name: true;
        };
      };
    };
  }>;

export interface ICityRepository {
  create(
    dto: CreateCityDto,
  ): Promise<City>;

  findAll(
    query: CityQueryDto,
  ): Promise<{
    data: CityWithState[];
    total: number;
  }>;

  findDropdown(
    query: CityDropdownDto,
  ): Promise<
    {
      uuid: string;
      name: string;
    }[]
  >;

  findByUuid(
    uuid: string,
  ): Promise<CityWithState | null>;

  findByName(
    name: string,
    stateUuid: string,
  ): Promise<City | null>;

  update(
    uuid: string,
    dto: UpdateCityDto,
  ): Promise<City>;

  softDelete(
    uuid: string,
  ): Promise<City>;
}