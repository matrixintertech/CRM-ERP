export type PermissionStatus =
  | "ACTIVE"
  | "INACTIVE";


export type PermissionType =
  | "PLATFORM"
  | "COMPANY";


export type PermissionScope =
  | "OWN"
  | "TEAM"
  | "ORGANIZATION_UNIT"
  | "PROJECT"
  | "COMPANY";


export type PermissionModule =
  // Shared / Company modules
  | "DASHBOARD"
  | "COMPANY"
  | "ORGANIZATION"
  | "BRANCH"
  | "ROLE"
  | "USER"
  | "PERMISSION"
  | "DEPARTMENT"
  | "DESIGNATION"
  | "EMPLOYEE"
  | "CLIENT"
  | "VENDOR"
  | "PROJECT"
  | "PROJECT_CATEGORY"
  | "PROJECT_ROLE"
  | "TASK"
  | "INVENTORY"
  | "PURCHASE"
  | "FINANCE"
  | "REPORT"
  | "SETTINGS"

  // Platform modules
  | "PLATFORM_COMPANY"
  | "PLATFORM_ROLE"
  | "PLATFORM_USER"
  | "PLATFORM_PERMISSION"
  | "PLATFORM_MODULE"
  | "PLATFORM_SUBSCRIPTION_PLAN"
  | "PLATFORM_VENDOR"
  | "PLATFORM_VENDOR_CATEGORY";
  

export type PermissionSortField =
  | "name"
  | "module"
  | "code"
  | "status";


export type SortOrder =
  | "asc"
  | "desc";


/*
 * Default scope for newly-created
 * COMPANY permissions.
 */
export const DEFAULT_COMPANY_PERMISSION_SCOPES:
  PermissionScope[] = [
    "COMPANY",
  ];


export interface Permission {
  id: string;
  uuid: string;

  module:
    PermissionModule;

  type:
    PermissionType;

  name:
    string;

  code:
    string;

  /*
   * Permission kin scopes ke
   * saath assign ho sakti hai.
   *
   * COMPANY:
   * minimum one scope.
   *
   * PLATFORM:
   * [].
   */
  allowedScopes:
    PermissionScope[];

  description?:
    string | null;

  status:
    PermissionStatus;

  createdAt:
    string;

  updatedAt:
    string;
}


export interface CreatePermissionDto {
  module:
    PermissionModule;

  type:
    PermissionType;

  name:
    string;

  code:
    string;

  /*
   * Required deliberately.
   *
   * COMPANY:
   * minimum one scope.
   *
   * PLATFORM:
   * [].
   */
  allowedScopes:
    PermissionScope[];

  description?:
    string;

  status?:
    PermissionStatus;
}


export interface UpdatePermissionDto
  extends Partial<CreatePermissionDto> {}


export type PermissionFormData =
  CreatePermissionDto;


export interface PermissionGroup {
  module:
    PermissionModule;

  permissions:
    Permission[];
}


export interface GetPermissionsParams {
  page?:
    number;

  limit?:
    number;

  search?:
    string;

  module?:
    PermissionModule;

  type?:
    PermissionType;

  status?:
    PermissionStatus;

  sortBy?:
    PermissionSortField;

  sortOrder?:
    SortOrder;
}


export interface PermissionPagination {
  page:
    number;

  limit:
    number;

  total:
    number;

  totalPages:
    number;
}


export interface PermissionFilters {
  modules:
    PermissionModule[];

  types:
    PermissionType[];
}


export interface PermissionListResponse {
  permissions:
    Permission[];

  pagination:
    PermissionPagination;

  filters:
    PermissionFilters;
}