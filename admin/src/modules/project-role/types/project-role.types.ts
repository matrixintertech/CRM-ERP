export type Status =
  | "ACTIVE"
  | "INACTIVE";

export interface ProjectRole {
  uuid: string;

  name: string;
  code: string;

  description?: string | null;

  isSingleAssignee: boolean;

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

  sortOrder?: number;
}

export interface UpdateProjectRoleRequest {
  name?: string;
  code?: string;

  description?: string;

  isSingleAssignee?: boolean;

  sortOrder?: number;

  status?: Status;
}

export interface ProjectRoleFormData {
  name: string;
  code: string;

  description: string;

  isSingleAssignee: boolean;

  sortOrder: number;

  status: Status;
}