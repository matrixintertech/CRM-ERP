export type PlatformRoleStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface PlatformPermission {
  uuid: string;

  module: string;

  name: string;

  code: string;

  description?: string | null;

  type: "PLATFORM";

  status:
    | "ACTIVE"
    | "INACTIVE";
}

export interface PlatformRole {
  id?: string;

  uuid: string;

  name: string;

  code: string;

  description?: string | null;

  isSystem: boolean;

  status:
    PlatformRoleStatus;

  permissions?: Array<{
    permission:
      PlatformPermission;
  }>;

  _count?: {
    users: number;
  };

  createdAt?: string;

  updatedAt?: string;
}

export interface CreatePlatformRoleDto {
  name: string;

  code: string;

  description?: string;

  isSystem?: boolean;
}

export interface UpdatePlatformRoleDto {
  name?: string;

  code?: string;

  description?: string;

  status?:
    PlatformRoleStatus;
}

export interface PlatformRoleFormData {
  name: string;

  code: string;

  description: string;

  status:
    PlatformRoleStatus;
}

export interface PlatformRolePermissionsResponse {
  role: {
    uuid: string;

    name: string;

    code: string;
  };

  permissions:
    PlatformPermission[];
}

export interface AssignPlatformRolePermissionsDto {
  permissionUuids:
    string[];
}