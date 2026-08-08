import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createPermission,
  deletePermission,
  getGroupedPermissions,
  getPermission,
  getPermissions,
  updatePermission,
} from "../api/permission.api";

import type {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../types/permission.types";

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

export const usePermission =
  () => {
    const queryClient =
      useQueryClient();

    const permissionsQuery =
      useQuery({
        queryKey: [
          "permissions",
        ],

        queryFn: () =>
          getPermissions(),

        staleTime:
          5 * 60 * 1000,
      });

    const groupedPermissionsQuery =
      useQuery({
        queryKey: [
          "grouped-permissions",
        ],

        queryFn: () =>
          getGroupedPermissions(),

        staleTime:
          5 * 60 * 1000,
      });

    const fetchPermission =
      async (
        id: string,
      ) => {
        try {
          return await queryClient.fetchQuery({
            queryKey: [
              "permission",
              id,
            ],

            queryFn: () =>
              getPermission(
                id,
              ),
          });
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load permission.",
            ),
          );

          throw error;
        }
      };

    const createMutation =
      useMutation({
        mutationFn: (
          payload:
            CreatePermissionDto,
        ) =>
          createPermission(
            payload,
          ),

        onSuccess: async () => {
          notify.success(
            "Permission created successfully.",
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "permissions",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "grouped-permissions",
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create permission.",
            ),
          );
        },
      });

    const updateMutation =
      useMutation({
        mutationFn: ({
          id,
          payload,
        }: {
          id: string;

          payload:
            UpdatePermissionDto;
        }) =>
          updatePermission(
            id,
            payload,
          ),

        onSuccess: async (
          _data,
          variables,
        ) => {
          notify.success(
            "Permission updated successfully.",
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "permissions",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "grouped-permissions",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "permission",
                variables.id,
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update permission.",
            ),
          );
        },
      });

    const deleteMutation =
      useMutation({
        mutationFn: (
          id: string,
        ) =>
          deletePermission(
            id,
          ),

        onSuccess: async (
          _data,
          id,
        ) => {
          notify.success(
            "Permission deleted successfully.",
          );

          queryClient.removeQueries({
            queryKey: [
              "permission",
              id,
            ],
          });

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "permissions",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "grouped-permissions",
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete permission.",
            ),
          );
        },
      });

    return {
      permissions:
        Array.isArray(
          permissionsQuery.data,
        )
          ? permissionsQuery.data
          : [],

      groupedPermissions:
        Array.isArray(
          groupedPermissionsQuery.data,
        )
          ? groupedPermissionsQuery.data
          : [],

      loading:
        permissionsQuery.isLoading ||
        groupedPermissionsQuery.isLoading,

      fetching:
        permissionsQuery.isFetching ||
        groupedPermissionsQuery.isFetching,

      error:
        permissionsQuery.error ??
        groupedPermissionsQuery.error,

      refetchPermissions:
        permissionsQuery.refetch,

      refetchGroupedPermissions:
        groupedPermissionsQuery.refetch,

      fetchPermission,

      create:
        createMutation.mutateAsync,

      update: (
        id: string,
        payload:
          UpdatePermissionDto,
      ) =>
        updateMutation.mutateAsync({
          id,
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