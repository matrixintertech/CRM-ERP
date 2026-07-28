export interface OrganizationUnitFormData {
  companyId: number;

  parentId?: number;

  type:
    | "HEAD_OFFICE"
    | "REGION"
    | "BRANCH"
    | "OFFICE";

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