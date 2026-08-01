export type OrganizationUnitStatus =
  | "ACTIVE"
  | "INACTIVE";

export type OrganizationUnitType =
  | "HEAD_OFFICE"
  | "REGION"
  | "BRANCH"
  | "OFFICE";

export interface OrganizationUnitCompany {
  uuid: string;
  name: string;
  code?: string;
}

export interface OrganizationUnitParent {
  uuid: string;
  name: string;
  code?: string;
}

export interface OrganizationUnitState {
  uuid: string;
  name: string;
}

export interface OrganizationUnitCity {
  uuid: string;
  name: string;
}

export interface OrganizationUnit {
  id: number;
  uuid: string;

  companyId: number;

  company?: OrganizationUnitCompany | null;

  parentId?: number | null;
  parent?: OrganizationUnitParent | null;

  type: OrganizationUnitType;

  name: string;
  code: string;

  email?: string | null;
  mobile?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;

  stateId?: number | null;
  cityId?: number | null;

  state?: OrganizationUnitState | null;
  city?: OrganizationUnitCity | null;

  country?: string | null;
  pincode?: string | null;

  status: OrganizationUnitStatus;

  createdAt: string;
  updatedAt: string;
}

export interface OrganizationUnitFormData {
  companyUuid?: string;

  parentUuid?: string;

  type: OrganizationUnitType;

  name: string;
  code: string;

  email: string;
  mobile: string;

  addressLine1: string;
  addressLine2: string;

  stateUuid: string;
  cityUuid: string;

  country: string;
  pincode: string;

  status: OrganizationUnitStatus;
}

export interface UpdateOrganizationUnitDto {
  parentUuid?: string;

  type?: OrganizationUnitType;

  name?: string;
  code?: string;

  email?: string;
  mobile?: string;

  addressLine1?: string;
  addressLine2?: string;

  stateUuid?: string;
  cityUuid?: string;

  country?: string;
  pincode?: string;

  status?: OrganizationUnitStatus;
}

export interface OrganizationUnitQueryParams {
  page?: number;
  limit?: number;

  search?: string;

  status?: OrganizationUnitStatus;
  type?: OrganizationUnitType;

  companyUuid?: string;
}

export interface OrganizationUnitListResponse {
  organizationUnits: OrganizationUnit[];

  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrganizationUnitResponse {
  organizationUnit: OrganizationUnit;
}

export interface OrganizationUnitDropdown {
  uuid: string;
  name: string;
  code: string;
  type: OrganizationUnitType;
}