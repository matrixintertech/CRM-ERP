import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import { cityApi } from "../api/city.api";

import type {
  City,
  CityDropdown,
  CityFormData,
  CityQueryParams,
} from "../types/city.types";

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: string[];
      };
    };
  };

  const errors =
    apiError.response?.data?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(", ");
  }

  return (
    apiError.response?.data?.message ??
    fallbackMessage
  );
};

export const useCities = () => {
  const [cities, setCities] =
    useState<City[]>([]);

  const [
    selectedCity,
    setSelectedCity,
  ] = useState<City | null>(null);

  const [
    dropdownCities,
    setDropdownCities,
  ] = useState<CityDropdown[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [total, setTotal] =
    useState(0);

  const fetchCities = useCallback(
    async (
      params: CityQueryParams = {},
    ) => {
      try {
        setLoading(true);

        const response =
          await cityApi.getAll(params);

        setCities(
          response.cities ?? [],
        );

        setTotal(
          response.total ?? 0,
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch cities:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load cities.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchDropdownCities =
    useCallback(
      async (
        stateUuid?: string,
      ) => {
        try {
          const response =
            await cityApi.getDropdown(
              stateUuid,
            );

          setDropdownCities(
            response.cities ?? [],
          );

          return response.cities;
        } catch (error: unknown) {
          console.error(
            "Failed to fetch city dropdown:",
            error,
          );

          notify.error(
            getErrorMessage(
              error,
              "Failed to load city dropdown.",
            ),
          );

          throw error;
        }
      },
      [],
    );

  const fetchCity = useCallback(
    async (uuid: string) => {
      try {
        setLoading(true);

        const city =
          await cityApi.getByUuid(
            uuid,
          );

        setSelectedCity(city);

        return city;
      } catch (error: unknown) {
        console.error(
          "Failed to fetch city:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load city details.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const create = useCallback(
    async (
      payload: CityFormData,
    ) => {
      try {
        setLoading(true);

        const response =
          await cityApi.create(
            payload,
          );

        notify.success(
          response?.message ??
            "City created successfully.",
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to create city:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create city.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      uuid: string,
      payload: Partial<CityFormData>,
    ) => {
      try {
        setLoading(true);

        const response =
          await cityApi.update(
            uuid,
            payload,
          );

        notify.success(
          response?.message ??
            "City updated successfully.",
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to update city:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update city.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(
    async (uuid: string) => {
      try {
        setLoading(true);

        const response =
          await cityApi.remove(uuid);

        notify.success(
          response?.message ??
            "City deleted successfully.",
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to delete city:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete city.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearSelectedCity =
    useCallback(() => {
      setSelectedCity(null);
    }, []);

  useEffect(() => {
    void fetchCities();
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

    clearSelectedCity,
  };
};