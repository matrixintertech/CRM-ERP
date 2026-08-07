export interface ProjectMemberEmployee {
  uuid: string;

  employeeCode: string;

  firstName: string;
  lastName?: string | null;

  displayName?: string | null;

  designation?: {
    uuid: string;
    name: string;
  } | null;

  department?: {
    uuid: string;
    name: string;
  } | null;
}

export interface ProjectMemberRequiredRole {
  uuid: string;

  name: string;
  code: string;
}

export interface ProjectMemberRole {
  uuid: string;

  name: string;
  code: string;

  isSingleAssignee: boolean;

  requiredRole?:
    | ProjectMemberRequiredRole
    | null;
}

export interface ProjectMember {
  uuid: string;

  employee:
    ProjectMemberEmployee;

  projectRole:
    ProjectMemberRole;

  remarks?: string | null;

  assignedAt: string;

  removedAt?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AssignProjectMemberRequest {
  employeeUuid: string;

  projectRoleUuid: string;

  remarks?: string;
}

export interface UpdateProjectMemberRequest {
  employeeUuid?: string;

  projectRoleUuid?: string;

  remarks?: string;
}

export interface ProjectMemberFormData {
  employeeUuid: string;

  projectRoleUuid: string;

  remarks: string;
}