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
}

export interface UsersResponse {
  message: string;

  users: User[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface Permission {
  uuid: string;

  module: string;

  name: string;

  code: string;

  description?: string | null;

  status: string;
}

export interface UserPermissions {
  user: User;

  role: Role | null;

  rolePermissions:
    Permission[];

  additionalPermissions:
    Permission[];

  effectivePermissions:
    Permission[];
}

export interface UpdateUserPermissionsDto {
  permissionUuids: string[];
}