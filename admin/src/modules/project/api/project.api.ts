
import api from "@/shared/services/axios";

import type {
  Project,
  ProjectListResponse,
  ProjectQuery,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project.types";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Get Projects
 */
export const getProjects = async (
  params: ProjectQuery,
): Promise<ProjectListResponse> => {
  const { data } =
    await api.get<ApiResponse<ProjectListResponse>>(
      "/projects",
      {
        params,
      },
    );

  return data.data;
};

/**
 * Get Project By UUID
 */
export const getProjectByUuid = async (
  uuid: string,
): Promise<Project> => {
  const { data } =
    await api.get<ApiResponse<Project>>(
      `/projects/${uuid}`,
    );

  return data.data;
};

/**
 * Create Project
 */
export const createProject = async (
  payload: CreateProjectRequest,
): Promise<Project> => {
  const { data } =
    await api.post<ApiResponse<Project>>(
      "/projects",
      payload,
    );

  return data.data;
};

/**
 * Update Project
 */
export const updateProject = async (
  uuid: string,
  payload: UpdateProjectRequest,
): Promise<Project> => {
  const { data } =
    await api.patch<ApiResponse<Project>>(
      `/projects/${uuid}`,
      payload,
    );

  return data.data;
};

/**
 * Delete Project
 */
export const deleteProject = async (
  uuid: string,
): Promise<void> => {
  await api.delete(`/projects/${uuid}`);
};