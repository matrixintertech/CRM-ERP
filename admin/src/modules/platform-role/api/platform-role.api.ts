import api from "@/shared/services/axios";

import type {
  PermissionGroup,
} from "../../permission/types/permission.types";

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
  status?: PlatformRoleStatus;
  search?: string;
}


interface PlatformRolePermissionCatalogResponse {
  message: string;

  groups: PermissionGroup[];
}


const BASE_URL =
  "/platform/roles";


export const getPlatformRoles =
  async (
    params:
      GetPlatformRolesParams = {},
  ): Promise<PlatformRole[]> => {
    const { data } =
      await api.get<
        ApiResponse<{
          message: string;
          roles: PlatformRole[];
        }>
      >(
        BASE_URL,
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
          role: PlatformRole;
        }>
      >(
        `${BASE_URL}/${uuid}`,
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
        `${BASE_URL}/dropdown`,
      );

    return data.data.roles;
  };


/*
 * Active PLATFORM permission catalog
 * used only for Platform Role
 * permission management.
 *
 * Backend access:
 * platform.platform_role.update
 */
export const getPlatformRolePermissionCatalog =
  async (): Promise<
    PermissionGroup[]
  > => {
    const { data } =
      await api.get<
        ApiResponse<
          PlatformRolePermissionCatalogResponse
        >
      >(
        `${BASE_URL}/permissions/catalog`,
      );

    return data.data.groups;
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
          role: PlatformRole;
        }>
      >(
        BASE_URL,
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
          role: PlatformRole;
        }>
      >(
        `${BASE_URL}/${uuid}`,
        payload,
      );

    return data.data.role;
  };


export const deletePlatformRole =
  async (
    uuid: string,
  ): Promise<void> => {
    await api.delete(
      `${BASE_URL}/${uuid}`,
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
        `${BASE_URL}/${uuid}/permissions`,
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
        `${BASE_URL}/${uuid}/permissions`,
        payload,
      );

    return data.data;
  };