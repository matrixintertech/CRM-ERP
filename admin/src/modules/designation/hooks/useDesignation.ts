import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createDesignation,
  deleteDesignation,
  getDesignation,
  getDesignations,
  updateDesignation,
} from "../api/designation.api";

import type {
  DesignationFormData,
  UpdateDesignationDto,
} from "../types/designation.types";

const getErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

  return (
    apiError.response?.data
      ?.message ??
    fallback
  );
};

export const useDesignation =
  () => {
    const queryClient =
      useQueryClient();

    const designationsQuery =
      useQuery({
        queryKey: [
          "designations",
        ],

        queryFn:
          getDesignations,

        staleTime:
          5 * 60 * 1000,
      });

    const fetchDesignation =
      async (
        uuid: string,
      ) => {
        try {
          return await queryClient.fetchQuery({
            queryKey: [
              "designation",
              uuid,
            ],

            queryFn: () =>
              getDesignation(
                uuid,
              ),
          });
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load designation.",
            ),
          );

          throw error;
        }
      };

    const createMutation =
      useMutation({
        mutationFn: (
          payload:
            DesignationFormData,
        ) =>
          createDesignation(
            payload,
          ),

        onSuccess: async (
          data,
        ) => {
          notify.success(
            data?.message ??
              "Designation created successfully.",
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "designations",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create designation.",
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
            UpdateDesignationDto;
        }) =>
          updateDesignation(
            uuid,
            payload,
          ),

        onSuccess: async (
          data,
          variables,
        ) => {
          notify.success(
            data?.message ??
              "Designation updated successfully.",
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "designations",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "designation",
                variables.uuid,
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update designation.",
            ),
          );
        },
      });

    const deleteMutation =
      useMutation({
        mutationFn: (
          uuid: string,
        ) =>
          deleteDesignation(
            uuid,
          ),

        onSuccess: async (
          data,
          uuid,
        ) => {
          notify.success(
            data?.message ??
              "Designation deleted successfully.",
          );

          queryClient.removeQueries({
            queryKey: [
              "designation",
              uuid,
            ],
          });

          await queryClient.invalidateQueries({
            queryKey: [
              "designations",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete designation.",
            ),
          );
        },
      });

    return {
      designations:
        Array.isArray(
          designationsQuery.data,
        )
          ? designationsQuery.data
          : [],

      loading:
        designationsQuery.isLoading,

      fetching:
        designationsQuery.isFetching,

      error:
        designationsQuery.error,

      refetch:
        designationsQuery.refetch,

      fetchDesignation,

      create:
        createMutation.mutateAsync,

      update: (
        uuid: string,
        payload:
          UpdateDesignationDto,
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