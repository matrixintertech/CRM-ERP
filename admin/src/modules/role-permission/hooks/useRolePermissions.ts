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

import type {
  RolePermissionAssignment,
} from "../types/role-permission.types";

export const useRolePermissions = (
  roleUuid?: string,
) => {
  const queryClient =
    useQueryClient();

  /*
   * Company roles ko sirf
   * COMPANY permissions dikhani hain.
   */
  const groupedPermissionsQuery =
    useQuery({
      queryKey: [
        "role-permission-groups",
        "COMPANY",
      ],

      queryFn: () =>
        getGroupedPermissions(
          "COMPANY",
        ),

      staleTime:
        5 * 60 * 1000,
    });

  const rolePermissionsQuery =
    useQuery({
      queryKey: [
        "role-permissions",
        roleUuid,
      ],

      queryFn: () =>
        getRolePermissions(
          roleUuid!,
        ),

      enabled:
        Boolean(
          roleUuid,
        ),

      staleTime:
        5 * 60 * 1000,
    });

  const saveMutation =
    useMutation({
      mutationFn: (
        permissions:
          RolePermissionAssignment[],
      ) => {
        if (!roleUuid) {
          throw new Error(
            "Role UUID is required.",
          );
        }

        return assignRolePermissions(
          roleUuid,
          {
            permissions,
          },
        );
      },

      onSuccess: async () => {
        notify.success(
          "Permissions updated successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "role-permissions",
            roleUuid,
          ],
        });
      },

      onError: () => {
        notify.error(
          "Failed to update permissions.",
        );
      },
    });

  const selectedPermissions:
    RolePermissionAssignment[] =
      rolePermissionsQuery.data
        ?.permissions
        ?.map(
          (
            permission,
          ) => ({
            permissionUuid:
              permission.uuid,

            scope:
              permission.scope,
          }),
        ) ?? [];

  return {
    groupedPermissions:
      groupedPermissionsQuery.data ??
      [],

    selectedPermissions,

    /*
     * Temporary/helper value.
     * Checkbox-only places me useful ho sakta hai.
     */
    selectedPermissionUuids:
      selectedPermissions.map(
        (
          permission,
        ) =>
          permission.permissionUuid,
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
      permissions:
        RolePermissionAssignment[],
    ) =>
      saveMutation.mutateAsync(
        permissions,
      ),

    refetchPermissions:
      rolePermissionsQuery.refetch,
  };
};