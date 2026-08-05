export interface CompanyFormData {
  name: string;
  code: string;
  email: string;
  mobile: string;
  logo: string;
}

export interface SubscriptionFormData {
  subscriptionPlanId: number;
}

export interface CompanyAdminFormData {
  displayName: string;
  email: string;
  mobile: string;
}

export interface CreateOnboardingDto {
  company: CompanyFormData;

  subscription: SubscriptionFormData;

  admin: CompanyAdminFormData;
}

export type CompanyStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export interface Company {
  id: string;
  uuid: string;

  name: string;
  code: string;

  email?: string | null;
  mobile?: string | null;
  logo?: string | null;

  type?: string | null;
  status: CompanyStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CompanyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CompanyListResponse {
  companies: Company[];
  pagination: CompanyPagination;
}

export interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}