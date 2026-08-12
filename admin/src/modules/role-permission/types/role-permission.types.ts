export type PermissionScope =
  | "OWN"
  | "TEAM"
  | "ORGANIZATION_UNIT"
  | "PROJECT"
  | "COMPANY";

export interface Permission {
  id: string;
  uuid: string;

  name: string;
  code: string;
  module: string;

  description?: string | null;

  type?: "COMPANY" | "PLATFORM";

  status?: "ACTIVE" | "INACTIVE";

  /*
   * Scopes supported by this permission.
   *
   * Examples:
   *
   * company.project.view
   * -> ["PROJECT", "COMPANY"]
   *
   * company.project_category.view
   * -> ["COMPANY"]
   */
  allowedScopes: PermissionScope[];
}

export interface PermissionGroupData {
  module: string;

  permissions:
    Permission[];
}

export interface RolePermission
  extends Permission {
  /*
   * Scope currently assigned
   * to this role.
   */
  scope: PermissionScope;
}

export interface RolePermissionsResponse {
  role: {
    uuid: string;
    name: string;
    code: string;
  };

  permissions:
    RolePermission[];
}

export interface RolePermissionAssignment {
  permissionUuid: string;

  scope: PermissionScope;
}

export interface AssignRolePermissionsDto {
  permissions:
    RolePermissionAssignment[];
}

export interface RolePermissionScopeMap {
  [permissionUuid: string]:
    PermissionScope;
}