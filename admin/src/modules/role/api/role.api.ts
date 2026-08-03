import api from "@/shared/services/axios";

import type {
  AssignRolePermissionsDto,
  CreateRoleDto,
  Role,
  RolePermissionResponse,
  UpdateRoleDto,
} from "../types/role.types";

export const createRole = async (
  payload: CreateRoleDto,
) => {
  const { data } = await api.post(
    "/roles",
    payload,
  );

  return (
    data.data?.role ??
    data.role ??
    data.data
  );
};

export const getRoles =
  async (): Promise<Role[]> => {
    const { data } = await api.get(
      "/roles",
    );

    return (
      data.data?.roles ??
      data.roles ??
      data.data ??
      []
    );
  };

export const getRole = async (
  uuid: string,
): Promise<Role> => {
  const { data } = await api.get(
    `/roles/${uuid}`,
  );

  return (
    data.data?.role ??
    data.role ??
    data.data
  );
};

export const updateRole = async (
  uuid: string,
  payload: UpdateRoleDto,
) => {
  const { data } = await api.patch(
    `/roles/${uuid}`,
    payload,
  );

  return (
    data.data?.role ??
    data.role ??
    data.data
  );
};

export const deleteRole = async (
  uuid: string,
) => {
  const { data } = await api.delete(
    `/roles/${uuid}`,
  );

  return data;
};

export const getRolePermissions = async (
  uuid: string,
): Promise<RolePermissionResponse> => {
  const { data } = await api.get(
    `/roles/${uuid}/permissions`,
  );

  return data.data ?? data;
};

export const assignRolePermissions = async (
  uuid: string,
  payload: AssignRolePermissionsDto,
) => {
  const { data } = await api.put(
    `/roles/${uuid}/permissions`,
    payload,
  );

  return data;
};