import {
  PermissionScope,
  PermissionType,
  UserType,
} from "@prisma/client";

export type PermissionSource =
  | "ROLE"
  | "USER"
  | "PLATFORM_ROLE";

export interface AuthorizationUserContext {
  id: bigint;

  uuid: string;

  userType:
    UserType;

  companyId:
    | bigint
    | null;

  employeeId:
    | bigint
    | null;

  roleId:
    | bigint
    | null;

  platformRoleId:
    | bigint
    | null;
}

/*
 * Base permission information.
 */
export interface EffectivePermission {
  permissionId:
    bigint;

  permissionUuid:
    string;

  module:
    string;

  name:
    string;

  code:
    string;

  type:
    PermissionType;

  source:
    PermissionSource;
}

/*
 * Platform permissions do not
 * use PermissionScope.
 */
export interface EffectivePlatformPermission
  extends EffectivePermission {
  type:
    "PLATFORM";

  source:
    "PLATFORM_ROLE";
}

/*
 * Company permissions always
 * carry a data access scope.
 */
export interface EffectiveCompanyPermission
  extends EffectivePermission {
  type:
    "COMPANY";

  source:
    | "ROLE"
    | "USER";

  scope:
    PermissionScope;
}

/*
 * Final resolved authorization
 * context for one authenticated user.
 */
export interface EffectiveAuthorization {
  user:
    AuthorizationUserContext;

  platformPermissions:
    EffectivePlatformPermission[];

  companyPermissions:
    EffectiveCompanyPermission[];
}

/*
 * Useful when guard only needs
 * permission code + allowed scopes.
 */
export interface CompanyPermissionGrant {
  code:
    string;

  scopes:
    PermissionScope[];
}