import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../api/employee.api";

import type {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/employee.types";

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

export const useEmployee =
  () => {
    const queryClient =
      useQueryClient();

    const employeesQuery =
      useQuery({
        queryKey: [
          "employees",
        ],

        queryFn: () =>
          getEmployees(),

        staleTime:
          5 * 60 * 1000,
      });

    const fetchEmployee =
      async (
        uuid: string,
      ) => {
        try {
          return await queryClient.fetchQuery({
            queryKey: [
              "employee",
              uuid,
            ],

            queryFn: () =>
              getEmployee(
                uuid,
              ),
          });
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load employee.",
            ),
          );

          throw error;
        }
      };

    const createMutation =
      useMutation({
        mutationFn: (
          payload:
            CreateEmployeeDto,
        ) =>
          createEmployee(
            payload,
          ),

        onSuccess: async (
          data,
        ) => {
          notify.success(
            data?.message ??
              "Employee created successfully.",
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "employees",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create employee.",
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
            UpdateEmployeeDto;
        }) =>
          updateEmployee(
            uuid,
            payload,
          ),

        onSuccess: async (
          data,
          variables,
        ) => {
          notify.success(
            data?.message ??
              "Employee updated successfully.",
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "employees",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "employee",
                variables.uuid,
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update employee.",
            ),
          );
        },
      });

    const deleteMutation =
      useMutation({
        mutationFn: (
          uuid: string,
        ) =>
          deleteEmployee(
            uuid,
          ),

        onSuccess: async (
          data,
          uuid,
        ) => {
          notify.success(
            data?.message ??
              "Employee deleted successfully.",
          );

          queryClient.removeQueries({
            queryKey: [
              "employee",
              uuid,
            ],
          });

          await queryClient.invalidateQueries({
            queryKey: [
              "employees",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete employee.",
            ),
          );
        },
      });

    return {
      employees:
        Array.isArray(
          employeesQuery.data,
        )
          ? employeesQuery.data
          : [],

      loading:
        employeesQuery.isLoading,

      fetching:
        employeesQuery.isFetching,

      error:
        employeesQuery.error,

      refetch:
        employeesQuery.refetch,

      fetchEmployee,

      create:
        createMutation.mutateAsync,

      update: (
        uuid: string,
        payload:
          UpdateEmployeeDto,
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