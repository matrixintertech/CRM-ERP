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
}

export interface ProfileResponse {
  profile: UserProfile;
}