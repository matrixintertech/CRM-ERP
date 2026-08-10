import api from "@/shared/services/axios";

import type {
  PermissionGroup,
  PermissionType,
} from "../../permission/types/permission.types";

import type {
  AssignRolePermissionsDto,
  RolePermissionsResponse,
} from "../types/role-permission.types";

export const getGroupedPermissions =
  async (
    type: PermissionType = "COMPANY",
  ): Promise<PermissionGroup[]> => {
    const { data } =
      await api.get(
        "/permissions/grouped",
        {
          params: {
            type,
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

export const getRolePermissions =
  async (
    roleUuid: string,
  ): Promise<RolePermissionsResponse> => {
    const { data } =
      await api.get(
        `/roles/${roleUuid}/permissions`,
      );

    return (
      data.data ??
      data
    );
  };

export const assignRolePermissions =
  async (
    roleUuid: string,
    payload: AssignRolePermissionsDto,
  ) => {
    const { data } =
      await api.put(
        `/roles/${roleUuid}/permissions`,
        payload,
      );

    return (
      data.data ??
      data
    );
  };