import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  assignRolePermissions,
  getGroupedPermissions,
  getRolePermissions,
} from "../api/role-permission.api";

export const useRolePermissions = (
  roleId?: string,
) => {
  const queryClient =
    useQueryClient();

  const groupedPermissionsQuery =
    useQuery({
      queryKey: [
        "role-permission-groups",
      ],

      queryFn: () =>
        getGroupedPermissions(),

      staleTime:
        5 * 60 * 1000,
    });

  const rolePermissionsQuery =
    useQuery({
      queryKey: [
        "role-permissions",
        roleId,
      ],

      queryFn: () =>
        getRolePermissions(
          roleId!,
        ),

      enabled:
        Boolean(
          roleId,
        ),
    });

  const saveMutation =
    useMutation({
      mutationFn: (
        permissionIds:
          string[],
      ) => {
        if (!roleId) {
          throw new Error(
            "Role ID is required.",
          );
        }

        return assignRolePermissions(
          roleId,
          permissionIds.map(
            Number,
          ),
        );
      },

      onSuccess: async () => {
        notify.success(
          "Permissions updated successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "role-permissions",
            roleId,
          ],
        });
      },

      onError: () => {
        notify.error(
          "Failed to update permissions.",
        );
      },
    });

  return {
    groupedPermissions:
      groupedPermissionsQuery.data ??
      [],

    selectedPermissions:
      (
        rolePermissionsQuery.data ??
        []
      ).map(
        String,
      ),

    loading:
      groupedPermissionsQuery.isLoading ||
      rolePermissionsQuery.isLoading,

    fetching:
      groupedPermissionsQuery.isFetching ||
      rolePermissionsQuery.isFetching,

    saving:
      saveMutation.isPending,

    savePermissions: (
      permissionIds:
        string[],
    ) =>
      saveMutation.mutateAsync(
        permissionIds,
      ),

    refetchPermissions:
      rolePermissionsQuery.refetch,
  };
};