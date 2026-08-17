export type ProjectTaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETION_REQUESTED"
  | "COMPLETED"
  | "CANCELLED";


export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";


export type ProjectTaskCompletionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";


export type ProjectTaskReportType =
  | "PROGRESS"
  | "BLOCKER"
  | "NOTE"
  | "COMPLETION";


export interface ProjectTaskAssignee {
  uuid: string;

  employee: {
    uuid: string;

    employeeCode?:
      | string
      | null;

    firstName?:
      | string
      | null;

    lastName?:
      | string
      | null;

    displayName?:
      | string
      | null;

    designation?: {
      uuid: string;
      name: string;
    } | null;

    department?: {
      uuid: string;
      name: string;
    } | null;
  };

  projectRole: {
    uuid: string;

    name: string;
    code: string;
  };
}


export interface ProjectTaskCompletionReport {
  uuid: string;

  type:
    ProjectTaskReportType;

  message:
    string;

  taskStatusSnapshot:
    ProjectTaskStatus;

  createdAt:
    string;
}


export interface ProjectTaskCompletionRequest {
  uuid: string;

  status:
    ProjectTaskCompletionStatus;

  workedSeconds:
    number;

  requestedAt:
    string;

  reviewNote?:
    | string
    | null;

  requestedByProjectMember: {
    uuid:
      string;

    employee: {
      uuid:
        string;

      employeeCode?:
        | string
        | null;

      firstName?:
        | string
        | null;

      lastName?:
        | string
        | null;

      displayName?:
        | string
        | null;

      designation?: {
        uuid:
          string;

        name:
          string;
      } | null;

      department?: {
        uuid:
          string;

        name:
          string;
      } | null;
    };

    projectRole: {
      uuid:
        string;

      name:
        string;

      code:
        string;
    };
  };

  report?:
    | ProjectTaskCompletionReport
    | null;
}


export interface ProjectTask {
  uuid: string;

  title: string;

  description?:
    | string
    | null;

  priority:
    TaskPriority;

  status:
    ProjectTaskStatus;

  startDate?:
    | string
    | null;

  dueDate?:
    | string
    | null;

  completedAt?:
    | string
    | null;

  remarks?:
    | string
    | null;

  sortOrder:
    number;

  assignedProjectMember?:
    | ProjectTaskAssignee
    | null;

  completionRequests:
    ProjectTaskCompletionRequest[];

  createdAt:
    string;

  updatedAt:
    string;
}


export interface CreateProjectTaskRequest {
  title: string;

  description?:
    string;

  priority?:
    TaskPriority;

  startDate?:
    string;

  dueDate?:
    string;

  assignedProjectMemberUuid?:
    | string
    | null;

  remarks?:
    string;

  sortOrder?:
    number;
}


export interface UpdateProjectTaskRequest {
  title?:
    string;

  description?:
    string;

  priority?:
    TaskPriority;

  startDate?:
    string;

  dueDate?:
    string;

  assignedProjectMemberUuid?:
    | string
    | null;

  remarks?:
    string;

  sortOrder?:
    number;
}


export interface ProjectTaskFormData {
  title:
    string;

  description:
    string;

  priority:
    TaskPriority;

  startDate:
    string;

  dueDate:
    string;

  assignedProjectMemberUuid:
    string;

  remarks:
    string;

  sortOrder:
    number;
}