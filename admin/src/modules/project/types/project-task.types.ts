export type ProjectTaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface ProjectTaskAssignee {
  uuid: string;

  employee: {
    uuid: string;

    employeeCode?: string | null;

    firstName?: string | null;
    lastName?: string | null;

    displayName?: string | null;
  };

  projectRole: {
    uuid: string;

    name: string;
    code: string;
  };
}

export interface ProjectTask {
  uuid: string;

  title: string;

  description?: string | null;

  priority: TaskPriority;

  status: ProjectTaskStatus;

  startDate?: string | null;

  dueDate?: string | null;

  completedAt?: string | null;

  remarks?: string | null;

  sortOrder: number;

  assignedProjectMember?:
    | ProjectTaskAssignee
    | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectTaskRequest {
  title: string;

  description?: string;

  priority?: TaskPriority;

  status?: ProjectTaskStatus;

  startDate?: string;

  dueDate?: string;

  assignedProjectMemberUuid?:
    | string
    | null;

  remarks?: string;

  sortOrder?: number;
}

export interface UpdateProjectTaskRequest {
  title?: string;

  description?: string;

  priority?: TaskPriority;

  status?: ProjectTaskStatus;

  startDate?: string;

  dueDate?: string;

  assignedProjectMemberUuid?:
    | string
    | null;

  remarks?: string;

  sortOrder?: number;
}

export interface ProjectTaskFormData {
  title: string;

  description: string;

  priority: TaskPriority;

  status: ProjectTaskStatus;

  startDate: string;

  dueDate: string;

  assignedProjectMemberUuid: string;

  remarks: string;

  sortOrder: number;
}