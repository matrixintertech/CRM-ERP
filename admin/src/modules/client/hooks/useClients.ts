import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createClient,
  deleteClient,
  getClientByUuid,
  getClientDropdown,
  getClients,
  updateClient,
} from "../api/client.api";

import type {
  ClientQueryParams,
  CreateClientDto,
  UpdateClientDto,
} from "../types/client.types";

const getErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?: string;
          errors?: string[];
        };
      };
    };

  const errors =
    apiError.response?.data
      ?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(
      ", ",
    );
  }

  return (
    apiError.response?.data
      ?.message ??
    fallback
  );
};

export const useClients = (
  params: ClientQueryParams = {},
) => {
  const queryClient =
    useQueryClient();

  const clientsQuery =
    useQuery({
      queryKey: [
        "clients",
        params,
      ],

      queryFn: () =>
        getClients(
          params,
        ),
    });

  const dropdownQuery =
    useQuery({
      queryKey: [
        "client-dropdown",
      ],

      queryFn:
        getClientDropdown,

      staleTime:
        5 * 60 * 1000,
    });

  const fetchClient =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "client",
            uuid,
          ],

          queryFn: () =>
            getClientByUuid(
              uuid,
            ),
        });
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load client details.",
          ),
        );

        throw error;
      }
    };

  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          CreateClientDto,
      ) =>
        createClient(
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Client created successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "clients",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "client-dropdown",
            ],
          }),
        ]);
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to create client.",
          ),
        );
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        uuid,
        payload,
      }: {
        uuid: string;

        payload:
          UpdateClientDto;
      }) =>
        updateClient(
          uuid,
          payload,
        ),

      onSuccess: async (
        _data,
        variables,
      ) => {
        notify.success(
          "Client updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "clients",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "client",
              variables.uuid,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "client-dropdown",
            ],
          }),
        ]);
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update client.",
          ),
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        uuid: string,
      ) =>
        deleteClient(
          uuid,
        ),

      onSuccess: async (
        _data,
        uuid,
      ) => {
        notify.success(
          "Client deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "client",
            uuid,
          ],
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "clients",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "client-dropdown",
            ],
          }),
        ]);
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to delete client.",
          ),
        );
      },
    });

  return {
    clients:
      clientsQuery.data
        ?.clients ?? [],

    total:
      clientsQuery.data
        ?.total ?? 0,

    dropdown:
      dropdownQuery.data ??
      [],

    loading:
      clientsQuery.isLoading,

    fetching:
      clientsQuery.isFetching,

    dropdownLoading:
      dropdownQuery.isLoading,

    dropdownFetching:
      dropdownQuery.isFetching,

    fetchClient,

    create:
      createMutation.mutateAsync,

    update: (
      uuid: string,
      payload:
        UpdateClientDto,
    ) =>
      updateMutation.mutateAsync({
        uuid,
        payload,
      }),

    remove:
      deleteMutation.mutateAsync,

    saving:
      createMutation.isPending ||
      updateMutation.isPending,

    deleting:
      deleteMutation.isPending,

    refetch:
      clientsQuery.refetch,

    refetchDropdown:
      dropdownQuery.refetch,
  };
};