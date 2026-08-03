import api from "@/shared/services/axios";

import type {
  CreatePermissionDto,
  Permission,
  PermissionGroup,
  UpdatePermissionDto,
} from "../types/permission.types";

export const createPermission = async (
  payload: CreatePermissionDto,
) => {
  const { data } = await api.post(
    "/permissions",
    payload,
  );

  return (
    data.data?.permission ??
    data.permission ??
    data.data
  );
};

export const getPermissions =
  async (): Promise<Permission[]> => {
    const { data } = await api.get(
      "/permissions",
    );

    return (
      data.data?.permissions ??
      data.permissions ??
      data.data ??
      []
    );
  };

export const getGroupedPermissions =
  async (): Promise<
    PermissionGroup[]
  > => {
    const { data } = await api.get(
      "/permissions/grouped",
    );

    return (
      data.data?.permissionGroups ??
      data.permissionGroups ??
      data.data ??
      []
    );
  };

export const getPermission = async (
  id: string,
): Promise<Permission> => {
  const { data } = await api.get(
    `/permissions/${id}`,
  );

  return (
    data.data?.permission ??
    data.permission ??
    data.data
  );
};

export const updatePermission = async (
  id: string,
  payload: UpdatePermissionDto,
) => {
  const { data } = await api.patch(
    `/permissions/${id}`,
    payload,
  );

  return (
    data.data?.permission ??
    data.permission ??
    data.data
  );
};

export const deletePermission = async (
  id: string,
) => {
  const { data } = await api.delete(
    `/permissions/${id}`,
  );

  return data;
};