import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from "../api/department.api";

import type {
  DepartmentFormData,
  UpdateDepartmentDto,
} from "../types/department.types";

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

export const useDepartment =
  () => {
    const queryClient =
      useQueryClient();

    /*
     * Department list
     */
   const departmentsQuery =
  useQuery({
    queryKey: [
      "departments",
    ],

    queryFn: () =>
      getDepartments(),

    staleTime:
      5 * 60 * 1000,
  });

    /*
     * Single department
     */
    const fetchDepartment =
      async (
        uuid: string,
      ) => {
        try {
          return await queryClient.fetchQuery({
            queryKey: [
              "department",
              uuid,
            ],

            queryFn: () =>
              getDepartment(
                uuid,
              ),
          });
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load department.",
            ),
          );

          throw error;
        }
      };

    /*
     * Create
     */
    const createMutation =
      useMutation({
        mutationFn: (
          payload:
            DepartmentFormData,
        ) =>
          createDepartment(
            payload,
          ),

        onSuccess: async (
          data,
        ) => {
          notify.success(
            data?.message ??
              "Department created successfully.",
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "departments",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create department.",
            ),
          );
        },
      });

    /*
     * Update
     */
    const updateMutation =
      useMutation({
        mutationFn: ({
          uuid,
          payload,
        }: {
          uuid: string;

          payload:
            UpdateDepartmentDto;
        }) =>
          updateDepartment(
            uuid,
            payload,
          ),

        onSuccess: async (
          data,
          variables,
        ) => {
          notify.success(
            data?.message ??
              "Department updated successfully.",
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "departments",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "department",
                variables.uuid,
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update department.",
            ),
          );
        },
      });

    /*
     * Delete
     */
    const deleteMutation =
      useMutation({
        mutationFn: (
          uuid: string,
        ) =>
          deleteDepartment(
            uuid,
          ),

        onSuccess: async (
          data,
          uuid,
        ) => {
          notify.success(
            data?.message ??
              "Department deleted successfully.",
          );

          queryClient.removeQueries({
            queryKey: [
              "department",
              uuid,
            ],
          });

          await queryClient.invalidateQueries({
            queryKey: [
              "departments",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete department.",
            ),
          );
        },
      });

    return {
      departments:
        Array.isArray(
          departmentsQuery.data,
        )
          ? departmentsQuery.data
          : [],

      loading:
        departmentsQuery.isLoading,

      fetching:
        departmentsQuery.isFetching,

      error:
        departmentsQuery.error,

      refetch:
        departmentsQuery.refetch,

      fetchDepartment,

      create:
        createMutation.mutateAsync,

      update: (
        uuid: string,
        payload:
          UpdateDepartmentDto,
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