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


export type AuthorizationBoundary =
  | "PLATFORM"
  | "COMPANY";


export type AccessPortal =
  | "PLATFORM"
  | "COMPANY"
  | "CLIENT"
  | "VENDOR";


export type PermissionType =
  | "COMPANY"
  | "PLATFORM";


export type PermissionScope =
  | "OWN"
  | "TEAM"
  | "ORGANIZATION_UNIT"
  | "PROJECT"
  | "COMPANY";


export type PermissionSource =
  | "ROLE"
  | "USER"
  | "PLATFORM_ROLE";


export interface EffectivePermission {
  code: string;

  type: PermissionType;

  /*
   * COMPANY permission ke liye scope hoga.
   *
   * PLATFORM permission currently
   * scope-less hai, isliye null.
   */
  scope:
    | PermissionScope
    | null;

  source:
    PermissionSource;
}


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

  userType:
    UserType;


  /*
   * Authorization data boundary.
   *
   * PLATFORM
   * → platform-level authorization
   *
   * COMPANY
   * → tenant/company-level authorization
   */
  authorizationBoundary:
    AuthorizationBoundary;


  /*
   * Application area shown to
   * the logged-in user.
   *
   * PLATFORM
   * → platform administration
   *
   * COMPANY
   * → internal company application
   *
   * CLIENT
   * → client portal
   *
   * VENDOR
   * → vendor portal
   */
  accessPortal:
    AccessPortal;


  displayName?: string | null;
  profilePhoto?: string | null;

  status:
    UserStatus;


  /*
   * Logged-in user's current effective
   * authorization grants.
   *
   * ROLE + USER for company users.
   * PLATFORM_ROLE for platform users.
   */
  effectivePermissions:
    EffectivePermission[];

  emailVerified?: boolean;
  mobileVerified?: boolean;

  lastLoginAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  company?:
    | UserProfileCompany
    | null;

  role?:
    | UserProfileRole
    | null;

  employee?:
    | UserProfileEmployee
    | null;
}


export interface ProfileResponse {
  profile:
    UserProfile;
}