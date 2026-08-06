export type PlatformUserStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export interface PlatformUser {
  id: string;
  uuid: string;

  displayName?: string | null;
  email?: string | null;
  mobile?: string | null;
  profilePhoto?: string | null;

  userType: "PLATFORM_OWNER";
  status: PlatformUserStatus;

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
}

export interface UpdatePlatformUserDto extends Partial<CreatePlatformUserDto> {
  status?: PlatformUserStatus;
}

export interface PlatformUserFormData {
  displayName: string;
  email: string;
  mobile: string;
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
