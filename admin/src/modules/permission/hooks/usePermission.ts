import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  PROFILE_QUERY_KEY,
} from "@/modules/profile/hooks/useProfile";

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


const PERMISSIONS_QUERY_KEY = [
  "permissions",
] as const;

const GROUPED_PERMISSIONS_QUERY_KEY = [
  "grouped-permissions",
] as const;

const PLATFORM_ROLE_PERMISSIONS_QUERY_KEY = [
  "platform-role-permissions",
] as const;


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

  if (
    Array.isArray(
      errors,
    )
  ) {
    return errors.join(
      ", ",
    );
  }

  if (
    typeof errors ===
    "string"
  ) {
    return errors;
  }

  return fallback;
};


export const usePermission = (
  params:
    GetPermissionsParams = {},
) => {
  const queryClient =
    useQueryClient();


  const permissionsQuery =
    useQuery({
      queryKey: [
        ...PERMISSIONS_QUERY_KEY,
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
        ...GROUPED_PERMISSIONS_QUERY_KEY,
        params.type ??
          "ALL",
      ],

      queryFn: () =>
        getGroupedPermissions(
          params.type,
        ),

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
      } catch (
        error
      ) {
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
            queryKey:
              PERMISSIONS_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey:
              GROUPED_PERMISSIONS_QUERY_KEY,
          }),
        ]);
      },

      onError: (
        error,
      ) => {
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
        permission,
        variables,
      ) => {
        queryClient.setQueryData(
          [
            "permission",
            variables.uuid,
          ],
          permission,
        );

        notify.success(
          "Permission updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              PERMISSIONS_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey:
              GROUPED_PERMISSIONS_QUERY_KEY,
          }),

          /*
           * PlatformRole permission pages
           * may contain this permission.
           */
          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLE_PERMISSIONS_QUERY_KEY,
          }),

          /*
           * If current user's assigned
           * permission changed status/code,
           * effectivePermissions must refresh.
           */
          queryClient.invalidateQueries({
            queryKey:
              PROFILE_QUERY_KEY,

            exact:
              true,
          }),
        ]);
      },

      onError: (
        error,
      ) => {
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
        queryClient.removeQueries({
          queryKey: [
            "permission",
            uuid,
          ],

          exact:
            true,
        });

        notify.success(
          "Permission deleted successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              PERMISSIONS_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey:
              GROUPED_PERMISSIONS_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLE_PERMISSIONS_QUERY_KEY,
          }),

          /*
           * Deleted/inactive permission
           * may currently belong to user role.
           */
          queryClient.invalidateQueries({
            queryKey:
              PROFILE_QUERY_KEY,

            exact:
              true,
          }),
        ]);
      },

      onError: (
        error,
      ) => {
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
        ?.permissions ??
      [],

    pagination:
      permissionsQuery.data
        ?.pagination ??
      null,

    moduleOptions:
      permissionsQuery.data
        ?.filters
        ?.modules ??
      [],

    typeOptions:
      permissionsQuery.data
        ?.filters
        ?.types ??
      [],

    groupedPermissions:
      groupedPermissionsQuery
        .data ??
      [],

    loading:
      permissionsQuery.isLoading,

    fetching:
      permissionsQuery.isFetching,

    groupedLoading:
      groupedPermissionsQuery
        .isLoading,

    groupedFetching:
      groupedPermissionsQuery
        .isFetching,

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