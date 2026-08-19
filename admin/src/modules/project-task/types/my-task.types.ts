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


export type MyTaskReportType =
  | "PROGRESS"
  | "BLOCKER"
  | "NOTE"
  | "COMPLETION";


export type MyTaskReportAttachmentType =
  | "IMAGE"
  | "DOCUMENT";


export interface MyTaskProject {
  uuid: string;
  srn: string;
  name: string;
}


export interface MyTaskEmployee {
  uuid: string;

  firstName: string;

  lastName?:
    string | null;

  displayName?:
    string | null;

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


/*
 * =========================================================
 * TASK REPORT AUTHOR
 * =========================================================
 *
 * Backend report query me limited
 * employee information return hoti hai.
 */
export interface MyTaskReportEmployee {
  uuid: string;

  firstName:
    string;

  lastName?:
    string | null;

  displayName?:
    string | null;
}


/*
 * Project member snapshot attached
 * with task report.
 */
export interface MyTaskReportProjectMember {
  uuid: string;

  employee:
    MyTaskReportEmployee;

  projectRole:
    MyTaskProjectRole;
}


/*
 * =========================================================
 * TASK REPORT ATTACHMENT
 * =========================================================
 *
 * Binary file R2 / S3 me stored hai.
 *
 * Frontend ko sirf metadata milta hai.
 *
 * Image ko directly storageKey se
 * access nahi karna.
 *
 * Private signed URL backend endpoint
 * se generate karna hai.
 */
export interface MyTaskReportAttachment {
  uuid: string;

  type:
    MyTaskReportAttachmentType;

  originalName:
    string;

  mimeType:
    string;

  /*
   * Prisma BigInt serialization
   * implementation ke depending
   * string ya number aa sakta hai.
   */
  sizeBytes:
    string | number;

  /*
   * Storage metadata only.
   *
   * Isse direct public image URL
   * construct nahi karna.
   */
  storageKey:
    string;

  createdAt:
    string;
}


/*
 * =========================================================
 * TASK ACTIVITY REPORT
 * =========================================================
 *
 * Progress / Blocker / Note /
 * Completion activity.
 */
export interface MyTaskReport {
  uuid: string;

  type:
    MyTaskReportType;

  message:
    string;

  taskStatusSnapshot:
    ProjectTaskStatus;

  createdAt:
    string;

  projectMember:
    MyTaskReportProjectMember;

  /*
   * Report evidence.
   *
   * Currently images supported for
   * PROGRESS / BLOCKER / NOTE.
   *
   * Type also keeps DOCUMENT support
   * for future expansion.
   */
  attachments:
    MyTaskReportAttachment[];
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


  /*
   * Backend latest 20 reports
   * return karta hai.
   *
   * Newest report first.
   *
   * Each report can now contain
   * evidence attachments.
   */
  reports:
    MyTaskReport[];


  /*
   * Total reports count.
   *
   * reports[] latest 20 ho sakte hain,
   * but ye actual total count hai.
   */
  _count: {
    reports:
      number;
  };
}