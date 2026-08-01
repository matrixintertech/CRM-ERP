import api from "@/shared/services/axios";

import type {
  City,
  CityDropdown,
  CityFormData,
  CityQueryParams,
} from "../types/city.types";

interface CityListResponse {
  cities: City[];
  total: number;
}

interface CityDetailsResponse {
  city: City;
}

interface CityDropdownResponse {
  cities: CityDropdown[];
}

export const cityApi = {
  async getAll(
    params: CityQueryParams = {},
  ): Promise<CityListResponse> {
    const { data } = await api.get(
      "/master/cities",
      {
        params,
      },
    );

    return data.data;
  },

  async getByUuid(
    uuid: string,
  ): Promise<City> {
    const { data } = await api.get(
      `/master/cities/${uuid}`,
    );

    return (
      data.data as CityDetailsResponse
    ).city;
  },

  async create(
    payload: CityFormData,
  ) {
    const { data } = await api.post(
      "/master/cities",
      payload,
    );

    return data;
  },

  async update(
    uuid: string,
    payload: Partial<CityFormData>,
  ) {
    const { data } = await api.patch(
      `/master/cities/${uuid}`,
      payload,
    );

    return data;
  },

  async remove(
    uuid: string,
  ) {
    const { data } = await api.delete(
      `/master/cities/${uuid}`,
    );

    return data;
  },

  async getDropdown(
    stateUuid?: string,
  ): Promise<CityDropdownResponse> {
    const { data } = await api.get(
      "/master/cities/dropdown",
      {
        params: {
          stateUuid,
          status: "ACTIVE",
        },
      },
    );

    return data.data;
  },
};