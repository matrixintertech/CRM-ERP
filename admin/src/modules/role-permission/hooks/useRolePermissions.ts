import { useState } from "react";

import { notify } from "@/shared/utils/notify";

import {
  assignRolePermissions,
  getGroupedPermissions,
  getRolePermissions,
} from "../api/role-permission.api";

import type {
  PermissionGroup,
} from "../types/role-permission.types";

export const useRolePermissions =
  () => {
    const [loading, setLoading] =
      useState(false);

    const [
      groupedPermissions,
      setGroupedPermissions,
    ] = useState<
      PermissionGroup[]
    >([]);

    const [
      selectedPermissions,
      setSelectedPermissions,
    ] = useState<string[]>([]);

    const fetchPermissions =
      async (
        roleId: string,
      ) => {
        setLoading(true);

        try {
          const [
            grouped,
            selected,
          ] =
            await Promise.all([
              getGroupedPermissions(),
              getRolePermissions(
                roleId,
              ),
            ]);

          setGroupedPermissions(
            grouped,
          );

          setSelectedPermissions(
            selected,
          );
        } finally {
          setLoading(false);
        }
      };

    const togglePermission = (
      permissionId: string,
    ) => {
      setSelectedPermissions(
        (prev) => {
          if (
            prev.includes(
              permissionId,
            )
          ) {
            return prev.filter(
              (id) =>
                id !==
                permissionId,
            );
          }

          return [
            ...prev,
            permissionId,
          ];
        },
      );
    };

 const savePermissions =
  async (
    roleId: string,
  ) => {
    setLoading(true);

   try {
  await notify.promise(
    assignRolePermissions(
      roleId,
      selectedPermissions.map(Number),
    ),
    {
      loading:
        "Saving permissions...",

      success:
        "Permissions updated successfully.",

      error:
        "Failed to update permissions.",
    },
  );
} finally {
  setLoading(false);
}
  };

    return {
      loading,

      groupedPermissions,

      selectedPermissions,

      fetchPermissions,

      togglePermission,

      savePermissions,
    };
  };