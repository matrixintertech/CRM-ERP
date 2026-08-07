import api from "@/shared/services/axios";

import type {
  CreateProjectRoleRequest,
  ProjectRole,
  UpdateProjectRoleRequest,
} from "../types/project-role.types";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface ProjectRolesData {
  projectRoles: ProjectRole[];
}

interface ProjectRoleData {
  projectRole: ProjectRole;
}

export const getProjectRoles =
  async (): Promise<ProjectRole[]> => {
    const { data } =
      await api.get<
        ApiResponse<ProjectRolesData>
      >("/project-roles");

    return (
      data.data.projectRoles ??
      []
    );
  };

export const getProjectRoleByUuid =
  async (
    uuid: string,
  ): Promise<ProjectRole> => {
    const { data } =
      await api.get<
        ApiResponse<ProjectRoleData>
      >(
        `/project-roles/${uuid}`,
      );

    return data.data.projectRole;
  };

export const createProjectRole =
  async (
    payload:
      CreateProjectRoleRequest,
  ): Promise<ProjectRole> => {
    const { data } =
      await api.post<
        ApiResponse<ProjectRoleData>
      >(
        "/project-roles",
        payload,
      );

    return data.data.projectRole;
  };

export const updateProjectRole =
  async (
    uuid: string,
    payload:
      UpdateProjectRoleRequest,
  ): Promise<ProjectRole> => {
    const { data } =
      await api.patch<
        ApiResponse<ProjectRoleData>
      >(
        `/project-roles/${uuid}`,
        payload,
      );

    return data.data.projectRole;
  };

export const deleteProjectRole =
  async (
    uuid: string,
  ): Promise<void> => {
    await api.delete(
      `/project-roles/${uuid}`,
    );
  };