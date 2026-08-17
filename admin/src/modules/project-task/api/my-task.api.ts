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