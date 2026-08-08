import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createState,
  deleteState,
  getState,
  getStateDropdown,
  getStates,
  updateState,
} from "../api/state.api";

import type {
  StateFormData,
  StateQueryParams,
} from "../types/state.types";

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
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
    fallbackMessage
  );
};

export const useStates = (
  params: StateQueryParams = {},
) => {
  const queryClient =
    useQueryClient();

  const statesQuery =
    useQuery({
      queryKey: [
        "states",
        params,
      ],

      queryFn: () =>
        getStates(
          params,
        ),

      staleTime:
        5 * 60 * 1000,
    });

  const dropdownQuery =
    useQuery({
      queryKey: [
        "state-dropdown",
      ],

      queryFn: () =>
        getStateDropdown(),

      staleTime:
        5 * 60 * 1000,
    });

  const fetchState =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "state",
            uuid,
          ],

          queryFn: () =>
            getState(
              uuid,
            ),
        });
      } catch (error) {
        console.error(
          "Failed to fetch state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load state details.",
          ),
        );

        throw error;
      }
    };

  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          StateFormData,
      ) =>
        createState(
          payload,
        ),

      onSuccess: async (
        data,
      ) => {
        notify.success(
          data?.message ??
            "State created successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "states",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "state-dropdown",
            ],
          }),
        ]);
      },

      onError: (error) => {
        console.error(
          "Failed to create state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create state.",
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
          Partial<StateFormData>;
      }) =>
        updateState(
          uuid,
          payload,
        ),

      onSuccess: async (
        data,
        variables,
      ) => {
        notify.success(
          data?.message ??
            "State updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "states",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "state-dropdown",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "state",
              variables.uuid,
            ],
          }),
        ]);
      },

      onError: (error) => {
        console.error(
          "Failed to update state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update state.",
          ),
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        uuid: string,
      ) =>
        deleteState(
          uuid,
        ),

      onSuccess: async (
        data,
        uuid,
      ) => {
        notify.success(
          data?.message ??
            "State deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "state",
            uuid,
          ],
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "states",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "state-dropdown",
            ],
          }),
        ]);
      },

      onError: (error) => {
        console.error(
          "Failed to delete state:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete state.",
          ),
        );
      },
    });

  return {
    states:
      Array.isArray(
        statesQuery.data,
      )
        ? statesQuery.data
        : [],

    dropdown:
      Array.isArray(
        dropdownQuery.data,
      )
        ? dropdownQuery.data
        : [],

    loading:
      statesQuery.isLoading,

    fetching:
      statesQuery.isFetching,

    dropdownLoading:
      dropdownQuery.isLoading,

    dropdownFetching:
      dropdownQuery.isFetching,

    error:
      statesQuery.error ??
      dropdownQuery.error,

    refetch:
      statesQuery.refetch,

    refetchDropdown:
      dropdownQuery.refetch,

    fetchState,

    create:
      createMutation.mutateAsync,

    update: (
      uuid: string,
      payload:
        Partial<StateFormData>,
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
  };
};