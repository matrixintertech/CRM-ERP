import api from "@/shared/services/axios";

import type {
  MyTask,
  MyTaskWorkSession,
} from "../types/my-task.types";


interface ApiResponse<T> {
  data: T;
}


interface MyTasksResponse {
  message: string;

  projectTasks:
    MyTask[];
}


interface StartWorkResponse {
  message: string;

  projectTask:
    MyTask;

  workSession:
    MyTaskWorkSession;
}


interface StopWorkResponse {
  message: string;

  workSession:
    MyTaskWorkSession;
}


export interface TaskWorkLocationPayload {
  latitude: number;

  longitude: number;

  accuracy?: number;

  address?: string | null;
}


export type ProjectTaskReportType =
  | "PROGRESS"
  | "BLOCKER"
  | "NOTE";


/*
 * =========================================================
 * TASK REPORT ATTACHMENT
 * =========================================================
 */
export type ProjectTaskAttachmentType =
  | "IMAGE"
  | "DOCUMENT";


export interface ProjectTaskReportAttachment {
  uuid: string;

  type:
    ProjectTaskAttachmentType;

  originalName:
    string;

  mimeType:
    string;

  /*
   * Backend BigInt serialization layer
   * ke depending string aa sakta hai.
   */
  sizeBytes:
    string | number;

  storageKey:
    string;

  createdAt:
    string;
}


/*
 * Report create karte waqt backend ko
 * ye metadata bhejna hai.
 *
 * Actual image already R2 par upload
 * ho chuki hogi.
 */
export interface CreateProjectTaskReportAttachment {
  storageKey: string;

  originalName: string;

  contentType:
    string;

  fileSize:
    number;
}


export interface ProjectTaskReport {
  uuid: string;

  type:
    ProjectTaskReportType;

  message:
    string;

  taskStatusSnapshot:
    string;

  createdAt:
    string;

  attachments?:
    ProjectTaskReportAttachment[];
}


interface CreateTaskReportResponse {
  message: string;

  report:
    ProjectTaskReport;
}


/*
 * =========================================================
 * PRESIGNED IMAGE UPLOAD
 * =========================================================
 */
export interface CreateTaskReportImageUploadResponse {
  key: string;

  url: string;

  method:
    "PUT";

  expiresInSeconds:
    number;

  headers: {
    "Content-Type":
      string;
  };

  originalName:
    string;

  contentType:
    string;

  fileSize:
    number;
}


/*
 * Final metadata jo report create
 * request me attachments[] ke andar
 * bhejenge.
 */
export interface UploadedTaskReportImage {
  storageKey:
    string;

  originalName:
    string;

  contentType:
    string;

  fileSize:
    number;
}


/*
 * =========================================================
 * SIGNED ATTACHMENT VIEW URL
 * =========================================================
 */
export interface TaskReportAttachmentViewResponse {
  attachment: {
    uuid:
      string;

    type:
      ProjectTaskAttachmentType;

    originalName:
      string;

    mimeType:
      string;

    fileSize:
      number;

    createdAt:
      string;
  };

  url:
    string;

  expiresInSeconds:
    number;
}


/*
 * Completion request response.
 */
export interface RequestTaskCompletionResponse {
  message: string;

  task: {
    uuid:
      string;

    status:
      "COMPLETION_REQUESTED";

    updatedAt:
      string;
  };

  completionRequest: {
    uuid:
      string;

    status:
      "PENDING";

    workedSeconds:
      number;

    requestedAt:
      string;

    report: {
      uuid:
        string;

      type:
        "COMPLETION";

      message:
        string;

      taskStatusSnapshot:
        string;

      createdAt:
        string;
    };
  };
}


/*
 * Logged-in employee ke
 * assigned tasks.
 */
export const getMyTasks =
  async (): Promise<
    MyTask[]
  > => {
    const { data } =
      await api.get<
        ApiResponse<
          MyTasksResponse
        >
      >(
        "/my/tasks",
      );

    return data.data
      .projectTasks;
  };


/*
 * Start employee work session.
 */
export const startMyTaskWork =
  async (
    projectUuid: string,
    taskUuid: string,
    location: TaskWorkLocationPayload,
  ): Promise<
    StartWorkResponse
  > => {
    const { data } =
      await api.post<
        ApiResponse<
          StartWorkResponse
        >
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}/start-work`,
        location,
      );

    return data.data;
  };


/*
 * Stop employee work session.
 */
export const stopMyTaskWork =
  async (
    projectUuid: string,
    taskUuid: string,
    location: TaskWorkLocationPayload,
  ): Promise<
    StopWorkResponse
  > => {
    const { data } =
      await api.post<
        ApiResponse<
          StopWorkResponse
        >
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}/stop-work`,
        location,
      );

    return data.data;
  };


/*
 * =========================================================
 * CREATE PRESIGNED IMAGE UPLOAD URL
 * =========================================================
 *
 * Backend:
 * - ownership check
 * - MIME/size validation
 * - safe storage key generation
 * - signed R2 PUT URL
 */
export const createMyTaskReportImageUploadUrl =
  async (
    taskUuid: string,
    file: File,
  ): Promise<
    CreateTaskReportImageUploadResponse
  > => {
    const { data } =
      await api.post<
        ApiResponse<
          CreateTaskReportImageUploadResponse
        >
      >(
        `/my/tasks/${taskUuid}/report-attachments/upload-url`,
        {
          fileName:
            file.name,

          contentType:
            file.type,

          fileSize:
            file.size,
        },
      );

    return data.data;
  };


/*
 * =========================================================
 * DIRECT IMAGE UPLOAD TO R2 / S3
 * =========================================================
 *
 * Important:
 *
 * Shared axios instance use nahi karenge.
 *
 * Presigned URL already complete external
 * URL hai aur uske saath Authorization
 * bearer token nahi jaana chahiye.
 */
export const uploadFileToPresignedUrl =
  async (
    file: File,
    upload:
      CreateTaskReportImageUploadResponse,
  ): Promise<void> => {
    const response =
      await fetch(
        upload.url,
        {
          method:
            upload.method,

          headers: {
            "Content-Type":
              upload.headers[
                "Content-Type"
              ],
          },

          body:
            file,
        },
      );


    if (!response.ok) {
      throw new Error(
        `Image upload failed with status ${response.status}.`,
      );
    }
  };


/*
 * =========================================================
 * COMPLETE TASK REPORT IMAGE UPLOAD
 * =========================================================
 *
 * Frontend component ko two separate
 * upload steps handle nahi karne padenge.
 *
 * 1. Backend se presigned URL
 * 2. Direct R2 upload
 * 3. Report-ready attachment metadata
 */
export const uploadMyTaskReportImage =
  async (
    taskUuid: string,
    file: File,
  ): Promise<
    UploadedTaskReportImage
  > => {
    const upload =
      await createMyTaskReportImageUploadUrl(
        taskUuid,
        file,
      );


    await uploadFileToPresignedUrl(
      file,
      upload,
    );


    return {
      storageKey:
        upload.key,

      originalName:
        upload.originalName,

      contentType:
        upload.contentType,

      fileSize:
        upload.fileSize,
    };
  };


/*
 * Add employee execution report.
 *
 * Allowed:
 *
 * PROGRESS
 * BLOCKER
 * NOTE
 *
 * attachments[] me sirf already uploaded
 * R2/S3 object metadata jayega.
 */
export const createMyTaskReport =
  async (
    projectUuid: string,
    taskUuid: string,

    payload: {
      type:
        ProjectTaskReportType;

      message:
        string;

      attachments?:
        CreateProjectTaskReportAttachment[];
    },
  ): Promise<
    CreateTaskReportResponse
  > => {
    const { data } =
      await api.post<
        ApiResponse<
          CreateTaskReportResponse
        >
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}/reports`,
        payload,
      );

    return data.data;
  };


/*
 * =========================================================
 * GET PRIVATE ATTACHMENT VIEW URL
 * =========================================================
 *
 * Backend ownership verify karega aur
 * short-lived signed R2/S3 GET URL dega.
 */
export const getMyTaskReportAttachmentViewUrl =
  async (
    taskUuid: string,
    attachmentUuid: string,
  ): Promise<
    TaskReportAttachmentViewResponse
  > => {
    const { data } =
      await api.get<
        ApiResponse<
          TaskReportAttachmentViewResponse
        >
      >(
        `/my/tasks/${taskUuid}/report-attachments/${attachmentUuid}/view-url`,
      );

    return data.data;
  };


/*
 * Employee requests task completion.
 *
 * Backend flow:
 *
 * IN_PROGRESS
 *      ↓
 * COMPLETION report
 *      ↓
 * PENDING completion request
 *      ↓
 * COMPLETION_REQUESTED
 */
export const requestMyTaskCompletion =
  async (
    projectUuid: string,
    taskUuid: string,
    message: string,
  ): Promise<
    RequestTaskCompletionResponse
  > => {
    const { data } =
      await api.post<
        ApiResponse<
          RequestTaskCompletionResponse
        >
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}/request-completion`,
        {
          message,
        },
      );

    return data.data;
  };



  