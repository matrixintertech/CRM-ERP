import { useCallback, useEffect, useState } from "react";

import { cityApi } from "../api/city.api";
import type {
  City,
  CityDropdown,
  CityFormData,
  CityQueryParams,
} from "../types/city.types";

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] =
    useState<City | null>(null);

  const [dropdownCities, setDropdownCities] =
    useState<CityDropdown[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [total, setTotal] =
    useState(0);

  const fetchCities = useCallback(
    async (
      params: CityQueryParams = {},
    ) => {
      setLoading(true);

      try {
        const response =
          await cityApi.getAll(params);

        setCities(response.cities);
        setTotal(response.total);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

const fetchDropdownCities = async (
    stateUuid?: string,
) => {
    const data =
        await cityApi.getDropdown(
            stateUuid,
        );

    setDropdownCities(data.cities);
}

  const fetchCity = async (
    uuid: string,
  ) => {
    setLoading(true);

    try {
      const response =
        await cityApi.getByUuid(uuid);

      setSelectedCity(
        response.city,
      );

      return response.city;
    } finally {
      setLoading(false);
    }
  };

  const create = async (
    data: CityFormData,
  ) => {
    return cityApi.create(data);
  };

  const update = async (
    uuid: string,
    data: Partial<CityFormData>,
  ) => {
    return cityApi.update(
      uuid,
      data,
    );
  };

  const remove = async (
    uuid: string,
  ) => {
    return cityApi.remove(uuid);
  };

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    loading,
    total,

    cities,
    selectedCity,
    dropdownCities,

    fetchCities,
    fetchCity,
    fetchDropdownCities,

    create,
    update,
    remove,
  };
};