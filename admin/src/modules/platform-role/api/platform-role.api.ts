import api from "@/shared/services/axios";

import type {
  AssignPlatformRolePermissionsDto,
  CreatePlatformRoleDto,
  PlatformRole,
  PlatformRolePermissionsResponse,
  PlatformRoleStatus,
  UpdatePlatformRoleDto,
} from "../types/platform-role.types";

interface ApiResponse<T> {
  success: boolean;

  statusCode: number;

  message: string;

  data: T;

  timestamp: string;

  path: string;
}

export interface GetPlatformRolesParams {
  status?:
    PlatformRoleStatus;

  search?: string;
}

export const getPlatformRoles =
  async (
    params:
      GetPlatformRolesParams = {},
  ): Promise<PlatformRole[]> => {
    const { data } =
      await api.get<
        ApiResponse<{
          message: string;

          roles:
            PlatformRole[];
        }>
      >(
        "/platform-roles",
        {
          params,
        },
      );

    return data.data.roles;
  };

export const getPlatformRoleByUuid =
  async (
    uuid: string,
  ): Promise<PlatformRole> => {
    const { data } =
      await api.get<
        ApiResponse<{
          message: string;

          role:
            PlatformRole;
        }>
      >(
        `/platform-roles/${uuid}`,
      );

    return data.data.role;
  };

export const getPlatformRoleDropdown =
  async (): Promise<
    Array<{
      uuid: string;

      name: string;

      code: string;
    }>
  > => {
    const { data } =
      await api.get<
        ApiResponse<{
          message: string;

          roles: Array<{
            uuid: string;

            name: string;

            code: string;
          }>;
        }>
      >(
        "/platform-roles/dropdown",
      );

    return data.data.roles;
  };

export const createPlatformRole =
  async (
    payload:
      CreatePlatformRoleDto,
  ): Promise<PlatformRole> => {
    const { data } =
      await api.post<
        ApiResponse<{
          message: string;

          role:
            PlatformRole;
        }>
      >(
        "/platform-roles",
        payload,
      );

    return data.data.role;
  };

export const updatePlatformRole =
  async (
    uuid: string,

    payload:
      UpdatePlatformRoleDto,
  ): Promise<PlatformRole> => {
    const { data } =
      await api.patch<
        ApiResponse<{
          message: string;

          role:
            PlatformRole;
        }>
      >(
        `/platform-roles/${uuid}`,
        payload,
      );

    return data.data.role;
  };

export const deletePlatformRole =
  async (
    uuid: string,
  ): Promise<void> => {
    await api.delete(
      `/platform-roles/${uuid}`,
    );
  };

export const getPlatformRolePermissions =
  async (
    uuid: string,
  ): Promise<PlatformRolePermissionsResponse> => {
    const { data } =
      await api.get<
        ApiResponse<
          PlatformRolePermissionsResponse
        >
      >(
        `/platform-roles/${uuid}/permissions`,
      );

    return data.data;
  };

export const assignPlatformRolePermissions =
  async (
    uuid: string,

    payload:
      AssignPlatformRolePermissionsDto,
  ): Promise<PlatformRolePermissionsResponse> => {
    const { data } =
      await api.put<
        ApiResponse<
          PlatformRolePermissionsResponse
        >
      >(
        `/platform-roles/${uuid}/permissions`,
        payload,
      );

    return data.data;
  };