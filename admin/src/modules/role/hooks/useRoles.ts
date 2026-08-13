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
  assignRolePermissions,
  createRole,
  deleteRole,
  getRole,
  getRolePermissions,
  getRoles,
  updateRole,
} from "../api/role.api";

import type {
  AssignRolePermissionsDto,
  CreateRoleDto,
  UpdateRoleDto,
} from "../types/role.types";

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

export const useRole = () => {
  const queryClient =
    useQueryClient();

  const rolesQuery =
    useQuery({
      queryKey: [
        "roles",
      ],

      queryFn: () =>
        getRoles(),

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
            "role",
            uuid,
          ],

          queryFn: () =>
            getRole(
              uuid,
            ),
        });
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load role.",
          ),
        );

        throw error;
      }
    };

  const fetchRolePermissions =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "role-permissions-detail",
            uuid,
          ],

          queryFn: () =>
            getRolePermissions(
              uuid,
            ),
        });
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load role permissions.",
          ),
        );

        throw error;
      }
    };

  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          CreateRoleDto,
      ) =>
        createRole(
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Role created successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "roles",
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to create role.",
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
          UpdateRoleDto;
      }) =>
        updateRole(
          uuid,
          payload,
        ),

      onSuccess: async (
        _data,
        variables,
      ) => {
        notify.success(
          "Role updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "roles",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "role",
              variables.uuid,
            ],
          }),
        ]);
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update role.",
          ),
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        uuid: string,
      ) =>
        deleteRole(
          uuid,
        ),

      onSuccess: async (
        _data,
        uuid,
      ) => {
        notify.success(
          "Role deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "role",
            uuid,
          ],
        });

        queryClient.removeQueries({
          queryKey: [
            "role-permissions-detail",
            uuid,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "roles",
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to delete role.",
          ),
        );
      },
    });

  const assignPermissionsMutation =
    useMutation({
      mutationFn: ({
        uuid,
        payload,
      }: {
        uuid: string;

        payload:
          AssignRolePermissionsDto;
      }) =>
        assignRolePermissions(
          uuid,
          payload,
        ),

     onSuccess: async (
  _data,
  variables,
) => {
  notify.success(
    "Role permissions updated successfully.",
  );

  await Promise.all([
    /*
     * Role permission screen ka
     * cached data refresh.
     */
    queryClient.invalidateQueries({
      queryKey: [
        "role-permissions-detail",
        variables.uuid,
      ],
    }),

    queryClient.invalidateQueries({
      queryKey: [
        "role-permissions",
        variables.uuid,
      ],
    }),

    /*
     * Current logged-in user's
     * effective permissions refresh.
     *
     * Agar edited role current user ka
     * role hai to sidebar/routes/buttons
     * immediately update ho jayenge.
     */
    queryClient.invalidateQueries({
      queryKey:
        PROFILE_QUERY_KEY,
    }),
  ]);
},

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update role permissions.",
          ),
        );
      },
    });

  return {
    roles:
      Array.isArray(
        rolesQuery.data,
      )
        ? rolesQuery.data
        : [],

    loading:
      rolesQuery.isLoading,

    fetching:
      rolesQuery.isFetching,

    error:
      rolesQuery.error,

    refetch:
      rolesQuery.refetch,

    fetchRole,

    fetchRolePermissions,

    create:
      createMutation.mutateAsync,

    update: (
      uuid: string,
      payload:
        UpdateRoleDto,
    ) =>
      updateMutation.mutateAsync({
        uuid,
        payload,
      }),

    remove:
      deleteMutation.mutateAsync,

    assignPermissions: (
      uuid: string,
      payload:
        AssignRolePermissionsDto,
    ) =>
      assignPermissionsMutation.mutateAsync({
        uuid,
        payload,
      }),

    saving:
      createMutation.isPending ||
      updateMutation.isPending,

    deleting:
      deleteMutation.isPending,

    savingPermissions:
      assignPermissionsMutation.isPending,
  };
};