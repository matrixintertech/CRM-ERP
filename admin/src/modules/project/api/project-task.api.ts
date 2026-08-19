import api from "@/shared/services/axios";

import type {
  CreateProjectTaskRequest,
  ProjectTask,
  ProjectTaskCompletionRequest,
  UpdateProjectTaskRequest,
} from "../types/project-task.types";


interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}


interface ProjectTasksData {
  projectTasks:
    ProjectTask[];
}


interface ProjectTaskData {
  projectTask:
    ProjectTask;
}


export type ProjectTaskCompletionDecision =
  | "APPROVED"
  | "REJECTED";


export interface ReviewProjectTaskCompletionPayload {
  decision:
    ProjectTaskCompletionDecision;

  reviewNote?:
    string;
}


interface ReviewProjectTaskCompletionData {
  task:
    ProjectTask;

  completionRequest:
    ProjectTaskCompletionRequest;
}


/*
 * =========================================================
 * TASK REPORT ATTACHMENT VIEW
 * =========================================================
 *
 * Manager / Company Admin project workspace
 * ke liye private task report evidence.
 *
 * Backend temporary signed R2/S3 GET URL
 * return karta hai.
 */
export interface ProjectTaskReportAttachmentViewAttachment {
  uuid:
    string;

  type:
    | "IMAGE"
    | "DOCUMENT";

  originalName:
    string;

  mimeType:
    string;

  fileSize:
    number;

  createdAt:
    string;
}


export interface ProjectTaskReportAttachmentViewResponse {
  attachment:
    ProjectTaskReportAttachmentViewAttachment;

  url:
    string;

  expiresInSeconds:
    number;
}


export const getProjectTasks =
  async (
    projectUuid: string,
  ): Promise<ProjectTask[]> => {
    const { data } =
      await api.get<
        ApiResponse<ProjectTasksData>
      >(
        `/projects/${projectUuid}/tasks`,
      );

    return (
      data.data.projectTasks ??
      []
    );
  };


export const getProjectTaskByUuid =
  async (
    projectUuid: string,
    taskUuid: string,
  ): Promise<ProjectTask> => {
    const { data } =
      await api.get<
        ApiResponse<ProjectTask>
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}`,
      );

    return data.data;
  };


export const createProjectTask =
  async (
    projectUuid: string,
    payload:
      CreateProjectTaskRequest,
  ): Promise<ProjectTask> => {
    const { data } =
      await api.post<
        ApiResponse<ProjectTaskData>
      >(
        `/projects/${projectUuid}/tasks`,
        payload,
      );

    return data.data.projectTask;
  };


export const updateProjectTask =
  async (
    projectUuid: string,
    taskUuid: string,
    payload:
      UpdateProjectTaskRequest,
  ): Promise<ProjectTask> => {
    const { data } =
      await api.patch<
        ApiResponse<ProjectTaskData>
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}`,
        payload,
      );

    return data.data.projectTask;
  };


export const deleteProjectTask =
  async (
    projectUuid: string,
    taskUuid: string,
  ): Promise<void> => {
    await api.delete(
      `/projects/${projectUuid}/tasks/${taskUuid}`,
    );
  };


/*
 * =========================================================
 * MANAGER COMPLETION REVIEW
 * =========================================================
 *
 * APPROVED
 *   -> task becomes COMPLETED
 *
 * REJECTED
 *   -> task returns to IN_PROGRESS
 *
 * Frontend UX me REJECTED ko
 * "Request Changes" label dikhayenge.
 */
export const reviewProjectTaskCompletion =
  async (
    projectUuid:
      string,

    taskUuid:
      string,

    payload:
      ReviewProjectTaskCompletionPayload,
  ): Promise<ReviewProjectTaskCompletionData> => {
    const { data } =
      await api.post<
        ApiResponse<ReviewProjectTaskCompletionData>
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}/review-completion`,
        payload,
      );

    return data.data;
  };


/*
 * =========================================================
 * REPORT ATTACHMENT SIGNED VIEW URL
 * =========================================================
 *
 * Project workspace:
 *
 * Manager / Company Admin report evidence
 * ko private bucket se preview karne ke
 * liye temporary signed GET URL.
 *
 * Important:
 *
 * - URL short-lived hai.
 * - Frontend storageKey se public URL
 *   construct nahi karega.
 * - Authorization backend enforce karega.
 */
export const getProjectTaskReportAttachmentViewUrl =
  async (
    projectUuid:
      string,

    taskUuid:
      string,

    attachmentUuid:
      string,
  ): Promise<ProjectTaskReportAttachmentViewResponse> => {
    const { data } =
      await api.get<
        ApiResponse<ProjectTaskReportAttachmentViewResponse>
      >(
        `/projects/${projectUuid}/tasks/${taskUuid}/report-attachments/${attachmentUuid}/view-url`,
      );

    return data.data;
  };