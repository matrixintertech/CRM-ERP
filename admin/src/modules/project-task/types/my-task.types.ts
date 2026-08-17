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


export interface MyTaskProject {
  uuid: string;
  srn: string;
  name: string;
}


export interface MyTaskEmployee {
  uuid: string;

  firstName: string;
  lastName?: string | null;
  displayName?: string | null;

  employeeCode: string;

  designation?: {
    uuid: string;
    name: string;
  } | null;

  department?: {
    uuid: string;
    name: string;
  } | null;
}


export interface MyTaskProjectRole {
  uuid: string;
  name: string;
  code: string;
}


export interface MyTaskProjectMember {
  uuid: string;

  employee:
    MyTaskEmployee;

  projectRole:
    MyTaskProjectRole;
}


export interface MyTaskWorkSession {
  uuid: string;

  status:
    | "OPEN"
    | "CLOSED";

  punchInAt: string;

  punchOutAt?:
    string | null;

  durationSeconds?:
    number | null;
}


export interface MyTaskCompletionRequest {
  uuid: string;

  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

  requestedAt:
    string;

  reviewedAt?:
    string | null;

  reviewNote?:
    string | null;
}


export interface MyTask {
  uuid: string;

  title: string;

  description?:
    string | null;

  priority:
    TaskPriority;

  status:
    ProjectTaskStatus;

  startDate?:
    string | null;

  dueDate?:
    string | null;

  completedAt?:
    string | null;

  remarks?:
    string | null;

  project:
    MyTaskProject;

  assignedProjectMember:
    MyTaskProjectMember;

  /*
   * Backend currently returns
   * latest OPEN session only.
   */
  workSessions:
    MyTaskWorkSession[];

  /*
   * Backend currently returns
   * latest PENDING request only.
   */
  completionRequests:
    MyTaskCompletionRequest[];
}