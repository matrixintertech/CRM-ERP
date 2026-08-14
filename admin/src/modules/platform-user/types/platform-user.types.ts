export type PlatformUserStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";


export interface PlatformUserRole {
  id: string;
  uuid: string;

  name: string;
  code: string;

  description?: string | null;

  isSystem: boolean;

  status: "ACTIVE" | "INACTIVE";
}


export interface PlatformUser {
  id: string;
  uuid: string;

  displayName?: string | null;
  email?: string | null;
  mobile?: string | null;
  profilePhoto?: string | null;

  userType: "PLATFORM_OWNER";
  status: PlatformUserStatus;

  platformRoleId?: string | null;

  platformRole?: PlatformUserRole | null;

  emailVerified: boolean;
  mobileVerified: boolean;

  lastLoginAt?: string | null;
  lastActiveAt?: string | null;

  createdAt: string;
  updatedAt: string;
}


export interface CreatePlatformUserDto {
  displayName: string;

  email: string;

  mobile?: string;

  platformRoleUuid: string;
}


export interface UpdatePlatformUserDto
  extends Partial<CreatePlatformUserDto> {
  status?: PlatformUserStatus;
}


export interface PlatformUserFormData {
  displayName: string;

  email: string;

  mobile: string;

  platformRoleUuid: string;

  status: PlatformUserStatus;
}


export interface PlatformUserListResponse {
  message: string;

  users: PlatformUser[];
}


export interface PlatformUserDetailsResponse {
  message: string;

  user: PlatformUser;
}