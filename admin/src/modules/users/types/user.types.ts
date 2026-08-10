export type UserStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export type UserType =
  | "PLATFORM_OWNER"
  | "COMPANY_ADMIN"
  | "EMPLOYEE"
  | "CLIENT"
  | "VENDOR";

export type UserSortField =
  | "name"
  | "email"
  | "status"
  | "userType"
  | "createdAt";

export type SortOrder =
  | "asc"
  | "desc";

export type PermissionScope =
  | "OWN"
  | "TEAM"
  | "ORGANIZATION_UNIT"
  | "PROJECT"
  | "COMPANY";

export type PermissionSource =
  | "ROLE"
  | "USER";

export interface Company {
  uuid: string;

  name: string;

  code: string;
}

export interface Role {
  uuid: string;

  name: string;

  code: string;

  status: string;
}

export interface OrganizationUnit {
  uuid: string;

  name: string;

  code: string;

  type?: string;
}

export interface Department {
  uuid: string;

  name: string;

  code: string;
}

export interface Designation {
  uuid: string;

  name: string;

  code: string;
}

export interface Employee {
  uuid: string;

  employeeCode: string;

  firstName?: string;

  lastName?: string;

  displayName?: string;

  email?: string;

  mobile?: string;

  avatarUrl?: string;

  organizationUnit?:
    | OrganizationUnit
    | null;

  department?:
    | Department
    | null;

  designation?:
    | Designation
    | null;
}

export interface User {
  uuid: string;

  displayName: string;

  email?: string | null;

  mobile?: string | null;

  profilePhoto?: string | null;

  userType: UserType;

  status: UserStatus;

  emailVerified?: boolean;

  mobileVerified?: boolean;

  lastLoginAt?: string | null;

  lastActiveAt?: string | null;

  createdAt?: string;

  updatedAt?: string;

  company?: Company | null;

  role?: Role | null;

  employee?: Employee | null;
}

export interface UserQueryParams {
  page?: number;

  limit?: number;

  search?: string;

  status?: UserStatus;

  userType?: UserType;

  roleUuid?: string;

  sortBy?: UserSortField;

  sortOrder?: SortOrder;
}

export interface UserPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface UsersResponse {
  message: string;

  users: User[];

  pagination:
    UserPagination;
}

export interface Permission {
  uuid: string;

  module: string;

  name: string;

  code: string;

  description?: string | null;

  type?: "COMPANY" | "PLATFORM";

  status: string;
}

export interface ScopedPermission
  extends Permission {
  scope:
    PermissionScope;

  source:
    PermissionSource;
}

export interface UserPermissions {
  user: User;

  role:
    Role | null;

  rolePermissions:
    ScopedPermission[];

  additionalPermissions:
    ScopedPermission[];

  effectivePermissions:
    ScopedPermission[];
}

export interface UserPermissionAssignment {
  permissionUuid:
    string;

  scope:
    PermissionScope;
}

export interface UpdateUserPermissionsDto {
  permissions:
    UserPermissionAssignment[];
}