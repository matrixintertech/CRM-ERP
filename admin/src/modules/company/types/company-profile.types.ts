export interface CompanyProfile {
  id: number;
  uuid: string;
  name: string;
  code: string;
  email?: string;
  mobile?: string;
  logo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCompanyProfile {
  name?: string;
  email?: string;
  mobile?: string;
}