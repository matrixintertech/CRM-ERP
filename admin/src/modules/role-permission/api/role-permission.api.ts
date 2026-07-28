import api from "@/shared/services/axios";

export const getGroupedPermissions =
  async () => {
    const { data } =
      await api.get(
        "/permissions/grouped",
      );

    return data.data;
  };

export const getRolePermissions =
  async (
    roleId: string,
  ) => {
    const { data } =
      await api.get(
        `/roles/${roleId}/permissions`,
      );

    return data.data.permissionIds;
  };

export const assignRolePermissions =
  async (
    roleId: string,
    permissionIds: number[],
  ) => {
    const { data } =
      await api.put(
        `/roles/${roleId}/permissions`,
        {
          permissionIds,
        },
      );

    return data;
  };