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


export type ProjectTaskReportType =
  | "PROGRESS"
  | "BLOCKER"
  | "NOTE";


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
}


interface CreateTaskReportResponse {
  message: string;

  report:
    ProjectTaskReport;
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
      );

    return data.data;
  };


/*
 * Add employee execution report.
 *
 * Allowed:
 *
 * PROGRESS
 * BLOCKER
 * NOTE
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