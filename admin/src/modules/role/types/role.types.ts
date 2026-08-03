export type RoleStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Permission {
  uuid: string;

  module: string;

  name: string;

  code: string;

  description?: string | null;

  status: RoleStatus;
}

export interface Role {
  id: string;
  uuid: string;

  name: string;
  code: string;

  description?: string | null;

  isSystem: boolean;

  status: RoleStatus;

  rolePermissions?: Array<{
    permission: Permission;
  }>;

  _count?: {
    employees: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;

  code: string;

  description?: string;

  isSystem?: boolean;
}

export interface UpdateRoleDto {
  name?: string;

  code?: string;

  description?: string;

  status?: RoleStatus;
}

export interface RoleFormData {
  name: string;

  code: string;

  description: string;

  status: RoleStatus;
}

export interface AssignRolePermissionsDto {
  permissionUuids: string[];
}

export interface RolePermissionResponse {
  role: {
    uuid: string;
    name: string;
    code: string;
  };

  permissionUuids: string[];

  permissions: Permission[];
}