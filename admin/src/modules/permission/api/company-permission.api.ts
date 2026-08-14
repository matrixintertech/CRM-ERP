import api from "@/shared/services/axios";

import type {
  PermissionGroup,
} from "../types/permission.types";


const BASE_URL =
  "/company/permissions";


interface CompanyGroupedPermissionsResponse {
  permissionGroups: PermissionGroup[];
}


export const getCompanyGroupedPermissions =
  async (): Promise<PermissionGroup[]> => {
    const { data } =
      await api.get(
        `${BASE_URL}/grouped`,
      );

    const response =
      data.data ?? data;

    return (
      response.permissionGroups ??
      []
    );
  };