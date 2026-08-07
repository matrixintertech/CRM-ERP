export type Status =
  | "ACTIVE"
  | "INACTIVE";

export interface ProjectRoleReference {
  uuid: string;

  name: string;
  code: string;
}

export interface ProjectRole {
  uuid: string;

  name: string;
  code: string;

  description?: string | null;

  isSingleAssignee: boolean;

  requiredRole?: ProjectRoleReference | null;

  sortOrder: number;

  status: Status;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRoleRequest {
  name: string;
  code: string;

  description?: string;

  isSingleAssignee?: boolean;

  requiredRoleUuid?: string;

  sortOrder?: number;
}

export interface UpdateProjectRoleRequest {
  name?: string;
  code?: string;

  description?: string;

  isSingleAssignee?: boolean;

  requiredRoleUuid?: string;

  sortOrder?: number;

  status?: Status;
}

export interface ProjectRoleFormData {
  name: string;
  code: string;

  description: string;

  isSingleAssignee: boolean;

  requiredRoleUuid: string;

  sortOrder: number;

  status: Status;
}