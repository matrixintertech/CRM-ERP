import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createProject,
  deleteProject,
  getProjectByUuid,
  getProjects,
  updateProject,
} from "../api/project.api";

import type {
  CreateProjectRequest,
  ProjectQuery,
  UpdateProjectRequest,
} from "../types/project.types";

const getErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

  return (
    apiError.response?.data
      ?.message ??
    fallback
  );
};

export const useProjects = (
  params: ProjectQuery = {},
) => {
  const queryClient =
    useQueryClient();

  const projectsQuery =
    useQuery({
      queryKey: [
        "projects",
        params,
      ],

      queryFn: () =>
        getProjects(
          params,
        ),
    });

  const fetchProject =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "project",
            uuid,
          ],

          queryFn: () =>
            getProjectByUuid(
              uuid,
            ),
        });
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load project details.",
          ),
        );

        throw error;
      }
    };

  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          CreateProjectRequest,
      ) =>
        createProject(
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Project created successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "projects",
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to create project.",
          ),
        );
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        uuid,
        payload,
      }: {
        uuid: string;

        payload:
          UpdateProjectRequest;
      }) =>
        updateProject(
          uuid,
          payload,
        ),

      onSuccess: async (
        _data,
        variables,
      ) => {
        notify.success(
          "Project updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "projects",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "project",
              variables.uuid,
            ],
          }),
        ]);
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update project.",
          ),
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        uuid: string,
      ) =>
        deleteProject(
          uuid,
        ),

      onSuccess: async (
        _data,
        uuid,
      ) => {
        notify.success(
          "Project deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "project",
            uuid,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "projects",
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to delete project.",
          ),
        );
      },
    });

  const projects =
    projectsQuery.data
      ?.projects ?? [];

  const total =
    projectsQuery.data
      ?.total ?? 0;

  return {
    projects,
    total,

    loading:
      projectsQuery.isLoading,

    fetching:
      projectsQuery.isFetching,

    error:
      projectsQuery.error,

    refetch:
      projectsQuery.refetch,

    fetchProject,

    create:
      createMutation.mutateAsync,

    update: (
      uuid: string,
      payload:
        UpdateProjectRequest,
    ) =>
      updateMutation.mutateAsync({
        uuid,
        payload,
      }),

    remove:
      deleteMutation.mutateAsync,

    saving:
      createMutation.isPending ||
      updateMutation.isPending,

    deleting:
      deleteMutation.isPending,
  };
};