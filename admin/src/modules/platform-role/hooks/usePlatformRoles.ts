import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

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
        "platform-roles",
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
        return await queryClient
          .fetchQuery({
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
        return await queryClient
          .fetchQuery({
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

        await queryClient
          .invalidateQueries({
            queryKey: [
              "platform-roles",
            ],
          });
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

        await queryClient
          .invalidateQueries({
            queryKey: [
              "platform-roles",
            ],
          });
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

      onSuccess: async () => {
        notify.success(
          "Platform role deleted successfully.",
        );

        await queryClient
          .invalidateQueries({
            queryKey: [
              "platform-roles",
            ],
          });
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

      onSuccess: (
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
      createMutation
        .mutateAsync(
          payload,
        ),

    updateRole: (
      uuid: string,
      payload:
        UpdatePlatformRoleDto,
    ) =>
      updateMutation
        .mutateAsync({
          uuid,
          payload,
        }),

    deleteRole: (
      uuid:
        string,
    ) =>
      deleteMutation
        .mutateAsync(
          uuid,
        ),

    savePermissions: (
      uuid: string,
      payload:
        AssignPlatformRolePermissionsDto,
    ) =>
      permissionsMutation
        .mutateAsync({
          uuid,
          payload,
        }),

    creating:
      createMutation
        .isPending,

    updating:
      updateMutation
        .isPending,

    deleting:
      deleteMutation
        .isPending,

    savingPermissions:
      permissionsMutation
        .isPending,
  };
};