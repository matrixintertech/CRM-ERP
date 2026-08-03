export type PermissionStatus =
  | "ACTIVE"
  | "INACTIVE";

export type PermissionModule =
  | "DASHBOARD"
  | "COMPANY"
  | "ORGANIZATION"
  | "BRANCH"
  | "ROLE"
  | "USER"
  | "DEPARTMENT"
  | "DESIGNATION"
  | "EMPLOYEE"
  | "CLIENT"
  | "VENDOR"
  | "PROJECT"
  | "PROJECT_CATEGORY"
  | "TASK"
  | "INVENTORY"
  | "PURCHASE"
  | "FINANCE"
  | "REPORT"
  | "SETTINGS";

export interface Permission {
  id: string;
  uuid: string;

  module: PermissionModule;

  name: string;
  code: string;

  description?: string | null;

  status: PermissionStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionDto {
  module: PermissionModule;

  name: string;
  code: string;

  description?: string;

  status?: PermissionStatus;
}

export interface UpdatePermissionDto
  extends Partial<CreatePermissionDto> {}

export type PermissionFormData =
  CreatePermissionDto;

export interface PermissionGroup {
  module: PermissionModule;
  permissions: Permission[];
}