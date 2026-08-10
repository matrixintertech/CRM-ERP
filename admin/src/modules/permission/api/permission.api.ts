import api from "@/shared/services/axios";

import type {
  CreatePermissionDto,
  GetPermissionsParams,
  Permission,
  PermissionGroup,
  PermissionListResponse,
  UpdatePermissionDto,
} from "../types/permission.types";

export const createPermission = async (
  payload: CreatePermissionDto,
): Promise<Permission> => {
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

export const getPermissions = async (
  params: GetPermissionsParams = {},
): Promise<PermissionListResponse> => {
  const { data } = await api.get(
    "/permissions",
    {
      params,
    },
  );

  const response =
    data.data ?? data;

  return {
    permissions:
      response.permissions ?? [],

    pagination:
      response.pagination ?? {
        page:
          params.page ?? 1,

        limit:
          params.limit ?? 10,

        total: 0,

        totalPages: 1,
      },

    filters:
      response.filters ?? {
        modules: [],
      },
  };
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
  uuid: string,
): Promise<Permission> => {
  const { data } = await api.get(
    `/permissions/${uuid}`,
  );

  return (
    data.data?.permission ??
    data.permission ??
    data.data
  );
};

export const updatePermission = async (
  uuid: string,
  payload: UpdatePermissionDto,
): Promise<Permission> => {
  const { data } = await api.patch(
    `/permissions/${uuid}`,
    payload,
  );

  return (
    data.data?.permission ??
    data.permission ??
    data.data
  );
};

export const deletePermission = async (
  uuid: string,
) => {
  const { data } = await api.delete(
    `/permissions/${uuid}`,
  );

  return data;
};