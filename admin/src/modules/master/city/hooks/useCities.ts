import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/shared/utils/notify";

import { cityApi } from "../api/city.api";

import type { CityFormData, CityQueryParams } from "../types/city.types";

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: string[];
      };
    };
  };

  const errors = apiError.response?.data?.errors;

  if (Array.isArray(errors) && errors.length > 0) {
    return errors.join(", ");
  }

  return apiError.response?.data?.message ?? fallbackMessage;
};

export const useCities = (
  params: CityQueryParams = {},
  dropdownStateUuid?: string,
) => {
  const queryClient = useQueryClient();

  const citiesQuery = useQuery({
    queryKey: ["cities", params],

    queryFn: () => cityApi.getAll(params),

    staleTime: 5 * 60 * 1000,
  });

  const dropdownQuery = useQuery({
    queryKey: ["city-dropdown", dropdownStateUuid ?? null],

    queryFn: () => cityApi.getDropdown(dropdownStateUuid),

    enabled: Boolean(dropdownStateUuid),

    staleTime: 5 * 60 * 1000,
  });

  const fetchCity = async (uuid: string) => {
    try {
      return await queryClient.fetchQuery({
        queryKey: ["city", uuid],

        queryFn: () => cityApi.getByUuid(uuid),
      });
    } catch (error) {
      console.error("Failed to fetch city:", error);

      notify.error(getErrorMessage(error, "Failed to load city details."));

      throw error;
    }
  };

  const createMutation = useMutation({
    mutationFn: (payload: CityFormData) => cityApi.create(payload),

    onSuccess: async (response) => {
      notify.success(response?.message ?? "City created successfully.");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cities"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["city-dropdown"],
        }),
      ]);
    },

    onError: (error) => {
      console.error("Failed to create city:", error);

      notify.error(getErrorMessage(error, "Failed to create city."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string;
      payload: Partial<CityFormData>;
    }) => cityApi.update(uuid, payload),

    onSuccess: async (response, variables) => {
      notify.success(response?.message ?? "City updated successfully.");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cities"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["city-dropdown"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["city", variables.uuid],
        }),
      ]);
    },

    onError: (error) => {
      console.error("Failed to update city:", error);

      notify.error(getErrorMessage(error, "Failed to update city."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => cityApi.remove(uuid),

    onSuccess: async (response, uuid) => {
      notify.success(response?.message ?? "City deleted successfully.");

      queryClient.removeQueries({
        queryKey: ["city", uuid],
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cities"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["city-dropdown"],
        }),
      ]);
    },

    onError: (error) => {
      console.error("Failed to delete city:", error);

      notify.error(getErrorMessage(error, "Failed to delete city."));
    },
  });

  const citiesResponse = citiesQuery.data;

  const dropdownResponse = dropdownQuery.data;

  return {
    cities: citiesResponse?.cities ?? [],

    total: citiesResponse?.total ?? 0,

    // getDropdown() already returns CityDropdown[]
    dropdownCities: dropdownResponse ?? [],

    loading: citiesQuery.isLoading,

    fetching: citiesQuery.isFetching,

    dropdownLoading: dropdownQuery.isLoading,

    dropdownFetching: dropdownQuery.isFetching,

    error: citiesQuery.error ?? dropdownQuery.error,

    refetch: citiesQuery.refetch,

    refetchDropdown: dropdownQuery.refetch,

    fetchCity,

    create: createMutation.mutateAsync,

    update: (uuid: string, payload: Partial<CityFormData>) =>
      updateMutation.mutateAsync({
        uuid,
        payload,
      }),

    remove: deleteMutation.mutateAsync,

    saving: createMutation.isPending || updateMutation.isPending,

    deleting: deleteMutation.isPending,
  };
};
