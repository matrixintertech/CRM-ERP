export type Gender =
  | "MALE"
  | "FEMALE";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN";

export type Status =
  | "ACTIVE"
  | "INACTIVE";

export type UserType =
  | "PLATFORM_OWNER"
  | "COMPANY_ADMIN"
  | "EMPLOYEE"
  | "VENDOR"
  | "CLIENT";

export type UserStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export interface EmployeeRelation {
  uuid: string;
  name: string;
  code?: string;
}

export interface EmployeeManager {
  uuid: string;
  displayName: string;
}

export interface EmployeeRole {
  uuid: string;
  name: string;
  code: string;
  status: Status;
}

export interface EmployeeUser {
  uuid: string;

  displayName?: string | null;

  email?: string | null;

  mobile?: string | null;

  userType: UserType;

  status: UserStatus;

  role?: EmployeeRole | null;
}

export interface Employee {
  uuid: string;

  employeeCode: string;

  firstName: string;

  lastName?: string | null;

  displayName?: string | null;

  email: string;

  mobile?: string | null;

  gender?: Gender | null;

  joiningDate?: string | null;

  employmentType?: EmploymentType | null;

  avatarUrl?: string | null;

  status: Status;

  organizationUnit?:
    | EmployeeRelation
    | null;

  department?:
    | EmployeeRelation
    | null;

  designation?:
    | EmployeeRelation
    | null;

  manager?:
    | EmployeeManager
    | null;

  user?:
    | EmployeeUser
    | null;

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

  organizationUnitUuid?: string;

  departmentUuid?: string;

  designationUuid?: string;

  managerUuid?: string;

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

  organizationUnitUuid?: string;

  departmentUuid?: string;

  designationUuid?: string;

  managerUuid?: string;

  joiningDate?: string;

  employmentType?: EmploymentType;

  avatarUrl?: string;

  status?: Status;
}