import api from "@/shared/services/axios";

import type {
  CreateProjectTaskRequest,
  ProjectTask,
  UpdateProjectTaskRequest,
} from "../types/project-task.types";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface ProjectTasksData {
  projectTasks: ProjectTask[];
}

interface ProjectTaskData {
  projectTask: ProjectTask;
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