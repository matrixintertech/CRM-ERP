import api from "@/shared/services/axios";

import type {
  CreatePermissionDto,
  GetPermissionsParams,
  Permission,
  PermissionGroup,
  PermissionListResponse,
  PermissionType,
  UpdatePermissionDto,
} from "../types/permission.types";


const BASE_URL =
  "/platform/permissions";


export const createPermission = async (
  payload: CreatePermissionDto,
): Promise<Permission> => {
  const { data } =
    await api.post(
      BASE_URL,
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
  const { data } =
    await api.get(
      BASE_URL,
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

        totalPages: 0,
      },

    filters:
      response.filters ?? {
        modules: [],
        types: [],
      },
  };
};


export const getGroupedPermissions =
  async (
    type?: PermissionType,
  ): Promise<PermissionGroup[]> => {
    const { data } =
      await api.get(
        `${BASE_URL}/grouped`,
        {
          params: {
            ...(type && {
              type,
            }),
          },
        },
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
  const { data } =
    await api.get(
      `${BASE_URL}/${uuid}`,
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
  const { data } =
    await api.patch(
      `${BASE_URL}/${uuid}`,
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
  const { data } =
    await api.delete(
      `${BASE_URL}/${uuid}`,
    );

  return data;
};