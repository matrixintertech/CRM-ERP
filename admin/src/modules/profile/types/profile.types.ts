export type UserStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export type UserType =
  | "PLATFORM_OWNER"
  | "COMPANY_ADMIN"
  | "EMPLOYEE"
  | "VENDOR"
  | "CLIENT";

export interface UserProfileCompany {
  uuid: string;
  name: string;
  code?: string | null;
}

export interface UserProfileRole {
  uuid: string;
  name: string;
  code?: string | null;
}

export interface UserProfileOrganizationUnit {
  uuid: string;
  name: string;
  code?: string | null;
}

export interface UserProfileDepartment {
  uuid: string;
  name: string;
  code?: string | null;
}

export interface UserProfileDesignation {
  uuid: string;
  name: string;
  code?: string | null;
}

export interface UserProfileEmployee {
  uuid: string;

  employeeCode?: string | null;
  displayName?: string | null;
  mobile?: string | null;

  employmentType?: string | null;
  joiningDate?: string | null;

  organizationUnit?:
    | UserProfileOrganizationUnit
    | null;

  department?:
    | UserProfileDepartment
    | null;

  designation?:
    | UserProfileDesignation
    | null;
}

export interface UserProfile {
  id: string;
  uuid: string;

  email?: string | null;
  mobile?: string | null;

  companyId?: string | null;
  employeeId?: string | null;
  roleId?: string | null;

  userType: UserType;

  displayName?: string | null;
  profilePhoto?: string | null;

  status: UserStatus;

  emailVerified?: boolean;
  mobileVerified?: boolean;

  lastLoginAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  company?: UserProfileCompany | null;
  role?: UserProfileRole | null;
  employee?: UserProfileEmployee | null;
}

export interface ProfileResponse {
  profile: UserProfile;
}