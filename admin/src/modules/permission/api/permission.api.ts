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


interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}


interface PermissionDetailsResponse {
  message: string;
  permission: Permission;
}


interface GroupedPermissionsResponse {
  message: string;
  type: PermissionType | null;
  permissionGroups: PermissionGroup[];
}


const BASE_URL =
  "/platform/permissions";


export const createPermission = async (
  payload: CreatePermissionDto,
): Promise<Permission> => {
  const { data } =
    await api.post<
      ApiResponse<PermissionDetailsResponse>
    >(
      BASE_URL,
      payload,
    );

  return data.data.permission;
};


export const getPermissions = async (
  params: GetPermissionsParams = {},
): Promise<PermissionListResponse> => {
  const { data } =
    await api.get<
      ApiResponse<PermissionListResponse>
    >(
      BASE_URL,
      {
        params,
      },
    );

  return data.data;
};


export const getGroupedPermissions =
  async (
    type?: PermissionType,
  ): Promise<PermissionGroup[]> => {
    const { data } =
      await api.get<
        ApiResponse<GroupedPermissionsResponse>
      >(
        `${BASE_URL}/grouped`,
        {
          params: {
            ...(type && {
              type,
            }),
          },
        },
      );

    return data.data.permissionGroups;
  };


export const getPermission = async (
  uuid: string,
): Promise<Permission> => {
  const { data } =
    await api.get<
      ApiResponse<PermissionDetailsResponse>
    >(
      `${BASE_URL}/${uuid}`,
    );

  return data.data.permission;
};


export const updatePermission = async (
  uuid: string,
  payload: UpdatePermissionDto,
): Promise<Permission> => {
  const { data } =
    await api.patch<
      ApiResponse<PermissionDetailsResponse>
    >(
      `${BASE_URL}/${uuid}`,
      payload,
    );

  return data.data.permission;
};


export const deletePermission = async (
  uuid: string,
): Promise<Permission> => {
  const { data } =
    await api.delete<
      ApiResponse<PermissionDetailsResponse>
    >(
      `${BASE_URL}/${uuid}`,
    );

  return data.data.permission;
};