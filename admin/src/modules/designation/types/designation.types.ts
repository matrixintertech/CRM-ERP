import type {
  OrganizationUnitDropdown,
} from "@/modules/organization-unit/types/organization-unit.types";

export type DesignationStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface DesignationDepartment {
  uuid: string;
  name: string;
  code: string;

  organizationUnit?:
    | OrganizationUnitDropdown
    | null;
}

export interface Designation {
  id: string;
  uuid: string;

  departmentId: string;

  department: DesignationDepartment;

  name: string;
  code: string;

  description?: string | null;

  status: DesignationStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreateDesignationDto {
  departmentUuid: string;

  name: string;
  code: string;

  description?: string;
}

export interface UpdateDesignationDto {
  departmentUuid?: string;

  name?: string;
  code?: string;

  description?: string;

  status?: DesignationStatus;
}

export type DesignationFormData =
  CreateDesignationDto;