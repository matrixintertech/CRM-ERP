export type OrganizationUnitType =
  | "HEAD_OFFICE"
  | "REGION"
  | "BRANCH"
  | "OFFICE";

export interface OrganizationUnit {
  id: number;
  uuid: string;

  companyId: number;

  parentId?: number | null;

  type: OrganizationUnitType;

  name: string;

  code: string;

  email: string;

  mobile: string;

  addressLine1: string;

  addressLine2: string;

  city: string;

  state: string;

  country: string;

  pincode: string;

  status: string;

  createdAt: string;

  updatedAt: string;
}

export interface OrganizationUnitFormData {

  parentId?: number;

  type: OrganizationUnitType;

  name: string;

  code: string;

  email: string;

  mobile: string;

  addressLine1: string;

  addressLine2: string;

  city: string;

  state: string;

  country: string;

  pincode: string;
}


export interface UpdateOrganizationUnitDto {
  name: string;
  code: string;
  email: string;
  mobile: string;

  addressLine1: string;
  addressLine2: string;

  city: string;
  state: string;
  country: string;
  pincode: string;

  status: "ACTIVE" | "INACTIVE";
}