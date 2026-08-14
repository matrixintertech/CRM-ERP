import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  PROFILE_QUERY_KEY,
} from "@/modules/profile/hooks/useProfile";

import {
  assignPlatformRolePermissions,
  createPlatformRole,
  deletePlatformRole,
  getPlatformRoleByUuid,
  getPlatformRolePermissions,
  getPlatformRoles,
  updatePlatformRole,
} from "../api/platform-role.api";

import type {
  AssignPlatformRolePermissionsDto,
  CreatePlatformRoleDto,
  PlatformRoleStatus,
  UpdatePlatformRoleDto,
} from "../types/platform-role.types";


interface ApiErrorResponse {
  message?: string;

  errors?:
    | string
    | string[];
}


const PLATFORM_ROLES_QUERY_KEY = [
  "platform-roles",
] as const;

const PLATFORM_ROLE_DROPDOWN_QUERY_KEY = [
  "platform-role-dropdown",
] as const;


const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  const apiError =
    error as {
      response?: {
        data?: ApiErrorResponse;
      };
    };

  const message =
    apiError.response
      ?.data?.message;

  const errors =
    apiError.response
      ?.data?.errors;

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

  return fallbackMessage;
};


export interface PlatformRoleQueryParams {
  status?:
    PlatformRoleStatus;

  search?: string;
}


export const usePlatformRoles = (
  params:
    PlatformRoleQueryParams = {},
) => {
  const queryClient =
    useQueryClient();


  const rolesQuery =
    useQuery({
      queryKey: [
        ...PLATFORM_ROLES_QUERY_KEY,
        params,
      ],

      queryFn: () =>
        getPlatformRoles(
          params,
        ),

      staleTime:
        5 * 60 * 1000,
    });


  const fetchRole =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "platform-role",
            uuid,
          ],

          queryFn: () =>
            getPlatformRoleByUuid(
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
            "Failed to load platform role.",
          ),
        );

        throw error;
      }
    };


  const fetchPermissions =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "platform-role-permissions",
            uuid,
          ],

          queryFn: () =>
            getPlatformRolePermissions(
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
            "Failed to load platform role permissions.",
          ),
        );

        throw error;
      }
    };


  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          CreatePlatformRoleDto,
      ) =>
        createPlatformRole(
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Platform role created successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLES_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLE_DROPDOWN_QUERY_KEY,
          }),
        ]);
      },

      onError: (
        error,
      ) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to create platform role.",
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
          UpdatePlatformRoleDto;
      }) =>
        updatePlatformRole(
          uuid,
          payload,
        ),

      onSuccess: async (
        role,
      ) => {
        queryClient.setQueryData(
          [
            "platform-role",
            role.uuid,
          ],
          role,
        );

        notify.success(
          "Platform role updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLES_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLE_DROPDOWN_QUERY_KEY,
          }),

          /*
           * Current logged-in user's
           * platform role may have changed
           * status/name or other role data.
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
            "Failed to update platform role.",
          ),
        );
      },
    });


  const deleteMutation =
    useMutation({
      mutationFn: (
        uuid:
          string,
      ) =>
        deletePlatformRole(
          uuid,
        ),

      onSuccess: async (
        _response,
        uuid,
      ) => {
        queryClient.removeQueries({
          queryKey: [
            "platform-role",
            uuid,
          ],

          exact:
            true,
        });

        queryClient.removeQueries({
          queryKey: [
            "platform-role-permissions",
            uuid,
          ],

          exact:
            true,
        });

        notify.success(
          "Platform role deleted successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLES_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLE_DROPDOWN_QUERY_KEY,
          }),
        ]);
      },

      onError: (
        error,
      ) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to delete platform role.",
          ),
        );
      },
    });


  const permissionsMutation =
    useMutation({
      mutationFn: ({
        uuid,
        payload,
      }: {
        uuid: string;

        payload:
          AssignPlatformRolePermissionsDto;
      }) =>
        assignPlatformRolePermissions(
          uuid,
          payload,
        ),

      onSuccess: async (
        response,
        variables,
      ) => {
        queryClient.setQueryData(
          [
            "platform-role-permissions",
            variables.uuid,
          ],
          response,
        );

        notify.success(
          "Platform role permissions updated successfully.",
        );

        /*
         * Important:
         *
         * Current logged-in user may belong
         * to the role whose permissions were
         * just changed.
         *
         * Refresh effectivePermissions.
         */
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_ROLES_QUERY_KEY,
          }),

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
            "Failed to update platform role permissions.",
          ),
        );
      },
    });


  return {
    roles:
      rolesQuery.data ??
      [],

    loading:
      rolesQuery.isLoading,

    fetching:
      rolesQuery.isFetching,

    error:
      rolesQuery.error,

    refetch:
      rolesQuery.refetch,

    fetchRole,

    fetchPermissions,

    createRole: (
      payload:
        CreatePlatformRoleDto,
    ) =>
      createMutation.mutateAsync(
        payload,
      ),

    updateRole: (
      uuid: string,
      payload:
        UpdatePlatformRoleDto,
    ) =>
      updateMutation.mutateAsync({
        uuid,
        payload,
      }),

    deleteRole: (
      uuid:
        string,
    ) =>
      deleteMutation.mutateAsync(
        uuid,
      ),

    savePermissions: (
      uuid: string,
      payload:
        AssignPlatformRolePermissionsDto,
    ) =>
      permissionsMutation.mutateAsync({
        uuid,
        payload,
      }),

    creating:
      createMutation.isPending,

    updating:
      updateMutation.isPending,

    deleting:
      deleteMutation.isPending,

    savingPermissions:
      permissionsMutation.isPending,
  };
};