export type RoleStatus =
  | "ACTIVE"
  | "INACTIVE";

export type PermissionScope =
  | "OWN"
  | "TEAM"
  | "ORGANIZATION_UNIT"
  | "PROJECT"
  | "COMPANY";

export interface Permission {
  uuid: string;

  module: string;

  name: string;

  code: string;

  description?: string | null;

  status: RoleStatus;

  scope?: PermissionScope;
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
    scope: PermissionScope;

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

export interface RolePermissionAssignment {
  permissionUuid: string;

  scope: PermissionScope;
}

export interface AssignRolePermissionsDto {
  permissions:
    RolePermissionAssignment[];
}

export interface RolePermissionItem
  extends Permission {
  scope: PermissionScope;
}

export interface RolePermissionResponse {
  role: {
    uuid: string;
    name: string;
    code: string;
  };

  permissions:
    RolePermissionItem[];
}