import api from "@/shared/services/axios";

import type {
  AssignProjectMemberRequest,
  ProjectMember,
  UpdateProjectMemberRequest,
} from "../types/project-member.types";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface ProjectMembersData {
  projectMembers: ProjectMember[];
}

interface ProjectMemberData {
  projectMember: ProjectMember;
}

export const getProjectMembers =
  async (
    projectUuid: string,
    includeHistory = false,
  ): Promise<ProjectMember[]> => {
    const { data } =
      await api.get<
        ApiResponse<ProjectMembersData>
      >(
        `/projects/${projectUuid}/members`,
        {
          params: {
            includeHistory,
          },
        },
      );

    return (
      data.data.projectMembers ??
      []
    );
  };

export const getProjectMemberByUuid =
  async (
    projectUuid: string,
    memberUuid: string,
  ): Promise<ProjectMember> => {
    const { data } =
      await api.get<
        ApiResponse<ProjectMember>
      >(
        `/projects/${projectUuid}/members/${memberUuid}`,
      );

    return data.data;
  };

export const assignProjectMember =
  async (
    projectUuid: string,
    payload:
      AssignProjectMemberRequest,
  ): Promise<ProjectMember> => {
    const { data } =
      await api.post<
        ApiResponse<ProjectMemberData>
      >(
        `/projects/${projectUuid}/members`,
        payload,
      );

    return data.data.projectMember;
  };

export const updateProjectMember =
  async (
    projectUuid: string,
    memberUuid: string,
    payload:
      UpdateProjectMemberRequest,
  ): Promise<ProjectMember> => {
    const { data } =
      await api.patch<
        ApiResponse<ProjectMemberData>
      >(
        `/projects/${projectUuid}/members/${memberUuid}`,
        payload,
      );

    return data.data.projectMember;
  };

export const removeProjectMember =
  async (
    projectUuid: string,
    memberUuid: string,
  ): Promise<void> => {
    await api.delete(
      `/projects/${projectUuid}/members/${memberUuid}`,
    );
  };