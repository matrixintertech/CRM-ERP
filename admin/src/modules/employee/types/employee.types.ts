// employee.types.ts

export type Gender =
  | "MALE"
  | "FEMALE"


export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN";

export type Status =
  | "ACTIVE"
  | "INACTIVE";

export interface Employee {
  uuid: string;
  employeeCode: string;

  firstName: string;
  lastName?: string;
  displayName?: string;

  email: string;
  mobile?: string;

  gender?: Gender;

  joiningDate?: string;

  employmentType?: EmploymentType;

  avatarUrl?: string;

  status: Status;

  organizationUnit?: {
    uuid: string;
    name: string;
  };

  department?: {
    uuid: string;
    name: string;
  };

  designation?: {
    uuid: string;
    name: string;
  };

  manager?: {
    uuid: string;
    displayName: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName?: string;
  displayName?: string;

  email: string;
  mobile?: string;

  gender?: Gender;

  organizationUnitId?: string;
  departmentId?: string;
  designationId?: string;
  managerId?: string;

  joiningDate?: string;

  employmentType?: EmploymentType;

  avatarUrl?: string;

  status?: Status;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;

  email?: string;
  mobile?: string;

  gender?: Gender;

  organizationUnitId?: string;
  departmentId?: string;
  designationId?: string;
  managerId?: string;

  joiningDate?: string;

  employmentType?: EmploymentType;

  avatarUrl?: string;

  status?: Status;
}