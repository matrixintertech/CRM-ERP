import type {
  ProjectTask,
} from "../../types/project-task.types";


export type ActivityReportType =
  | "PROGRESS"
  | "BLOCKER"
  | "NOTE"
  | "COMPLETION";


export type ActivityCompletionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";


export interface ActivityAttachment {
  uuid: string;

  type:
    | "IMAGE"
    | "DOCUMENT";

  originalName: string;

  mimeType: string;

  sizeBytes:
    string | number;

  storageKey: string;

  createdAt: string;
}


export interface ActivityReport {
  uuid: string;

  type:
    ActivityReportType;

  message: string;

  taskStatusSnapshot: string;

  createdAt: string;

  attachments?:
    ActivityAttachment[];

  projectMember?: {
    uuid: string;

    employee?: {
      uuid: string;

      displayName?:
        string | null;

      firstName?:
        string | null;

      lastName?:
        string | null;
    } | null;

    projectRole?: {
      uuid: string;

      name: string;

      code: string;
    } | null;
  } | null;
}


export interface ActivityCompletionRequest {
  uuid: string;

  status:
    ActivityCompletionStatus;

  workedSeconds?:
    number;

  requestedAt: string;

  reviewedAt?:
    string | null;

  reviewNote?:
    string | null;

  reviewedByUser?: {
    uuid: string;
  } | null;

  report?: {
    uuid: string;

    type:
      ActivityReportType;

    message: string;

    taskStatusSnapshot: string;

    createdAt: string;
  } | null;
}


export type ProjectTaskWithActivity =
  ProjectTask & {
    reports?:
      ActivityReport[];

    completionRequests?:
      ActivityCompletionRequest[];

    _count?: {
      reports: number;
    };
  };


export type TimelineItem =
  | {
      kind: "REPORT";

      key: string;

      occurredAt: string;

      report:
        ActivityReport;
    }
  | {
      kind: "COMPLETION_REVIEW";

      key: string;

      occurredAt: string;

      completionRequest:
        ActivityCompletionRequest;
    };