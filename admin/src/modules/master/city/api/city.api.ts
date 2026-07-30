import api from "@/shared/services/axios";

import type {
  City,
  CityDropdown,
  CityFormData,
  CityQueryParams,
} from "../types/city.types";

export const cityApi = {
  async getAll(params: CityQueryParams) {
    const response = await api.get("/master/cities", {
      params,
    });

    return response.data.data as {
      cities: City[];
      total: number;
    };
  },

  async getByUuid(uuid: string) {
    const response = await api.get(
      `/master/cities/${uuid}`,
    );

    return response.data.data
      .state as {
      city: City;
    };
  },

  async create(data: CityFormData) {
    const response = await api.post(
      "/master/cities",
      data,
    );

    return response.data.data;
  },

  async update(
    uuid: string,
    data: Partial<CityFormData>,
  ) {
    const response = await api.patch(
      `/master/cities/${uuid}`,
      data,
    );

    return response.data.data;
  },

  async remove(uuid: string) {
    await api.delete(
      `/master/cities/${uuid}`,
    );
  },

  async getDropdown(
  stateUuid?: string,
) {
  const response = await api.get(
    "/master/cities/dropdown",
    {
      params: {
        stateUuid,
        status: "ACTIVE",
      },
    },
  );

  return response.data.data as {
    cities: CityDropdown[];
  };
}
};