export type DepartmentStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface DepartmentOrganizationUnit {
  uuid: string;
  name: string;
  code: string;
}

export interface Department {
  id: string;
  uuid: string;

  organizationUnitId: string;

  organizationUnit: DepartmentOrganizationUnit;

  name: string;
  code: string;

  description?: string | null;

  status: DepartmentStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  organizationUnitUuid: string;

  name: string;
  code: string;

  description?: string;
}

export interface UpdateDepartmentDto {
  organizationUnitUuid?: string;

  name?: string;
  code?: string;

  description?: string;

  status?: DepartmentStatus;
}

export type DepartmentFormData =
  CreateDepartmentDto;


  export interface DepartmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: DepartmentStatus;
  organizationUnitUuid?: string;
}