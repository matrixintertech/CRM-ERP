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
  GetPermissionsParams,
  Permission,
  UpdatePermissionDto,
} from "../types/permission.types";

interface ApiErrorResponse {
  message?: string;

  errors?:
    | string
    | string[];
}

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const apiError =
    error as {
      response?: {
        data?: ApiErrorResponse;
      };
    };

  const message =
    apiError.response?.data
      ?.message;

  const errors =
    apiError.response?.data
      ?.errors;

  if (message) {
    return message;
  }

  if (Array.isArray(errors)) {
    return errors.join(", ");
  }

  if (
    typeof errors === "string"
  ) {
    return errors;
  }

  return fallback;
};

export const usePermission = (
  params: GetPermissionsParams = {},
) => {
  const queryClient =
    useQueryClient();

  const permissionsQuery =
    useQuery({
      queryKey: [
        "permissions",
        params,
      ],

      queryFn: () =>
        getPermissions(
          params,
        ),

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
      uuid: string,
    ): Promise<Permission> => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "permission",
            uuid,
          ],

          queryFn: () =>
            getPermission(
              uuid,
            ),

          staleTime:
            5 * 60 * 1000,
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
        uuid,
        payload,
      }: {
        uuid: string;

        payload:
          UpdatePermissionDto;
      }) =>
        updatePermission(
          uuid,
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
              variables.uuid,
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
        uuid: string,
      ) =>
        deletePermission(
          uuid,
        ),

      onSuccess: async (
        _data,
        uuid,
      ) => {
        notify.success(
          "Permission deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "permission",
            uuid,
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
      permissionsQuery.data
        ?.permissions ?? [],

    pagination:
      permissionsQuery.data
        ?.pagination ?? null,

    moduleOptions:
      permissionsQuery.data
        ?.filters?.modules ??
      [],

    groupedPermissions:
      groupedPermissionsQuery
        .data ?? [],

    loading:
      permissionsQuery.isLoading,

    fetching:
      permissionsQuery.isFetching,

    groupedLoading:
      groupedPermissionsQuery.isLoading,

    groupedFetching:
      groupedPermissionsQuery.isFetching,

    error:
      permissionsQuery.error,

    groupedError:
      groupedPermissionsQuery.error,

    refetchPermissions:
      permissionsQuery.refetch,

    refetchGroupedPermissions:
      groupedPermissionsQuery.refetch,

    fetchPermission,

    create:
      createMutation.mutateAsync,

    update: (
      uuid: string,
      payload:
        UpdatePermissionDto,
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