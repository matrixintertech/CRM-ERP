import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createProjectTask,
  deleteProjectTask,
  getProjectTaskByUuid,
  getProjectTasks,
  updateProjectTask,
} from "../api/project-task.api";

import type {
  CreateProjectTaskRequest,
  UpdateProjectTaskRequest,
} from "../types/project-task.types";

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

export const useProjectTasks = (
  projectUuid?: string,
  enabled = true,
) => {
  const queryClient =
    useQueryClient();

  const tasksQuery =
    useQuery({
      queryKey: [
        "project-tasks",
        projectUuid,
      ],

      queryFn: () =>
        getProjectTasks(
          projectUuid!,
        ),

      enabled:
        Boolean(
          projectUuid,
        ) &&
        enabled,
    });

  const fetchProjectTask =
    async (
      taskUuid: string,
    ) => {
      if (!projectUuid) {
        throw new Error(
          "Project UUID is required.",
        );
      }

      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "project-task",
            projectUuid,
            taskUuid,
          ],

          queryFn: () =>
            getProjectTaskByUuid(
              projectUuid,
              taskUuid,
            ),
        });
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load project task.",
          ),
        );

        throw error;
      }
    };

  const createMutation =
    useMutation({
      mutationFn: (
        payload:
          CreateProjectTaskRequest,
      ) => {
        if (!projectUuid) {
          throw new Error(
            "Project UUID is required.",
          );
        }

        return createProjectTask(
          projectUuid,
          payload,
        );
      },

      onSuccess: async () => {
        notify.success(
          "Project task created successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "project-tasks",
            projectUuid,
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to create project task.",
          ),
        );
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        taskUuid,
        payload,
      }: {
        taskUuid: string;
        payload:
          UpdateProjectTaskRequest;
      }) => {
        if (!projectUuid) {
          throw new Error(
            "Project UUID is required.",
          );
        }

        return updateProjectTask(
          projectUuid,
          taskUuid,
          payload,
        );
      },

      onSuccess: async (
        _data,
        variables,
      ) => {
        notify.success(
          "Project task updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "project-tasks",
              projectUuid,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "project-task",
              projectUuid,
              variables.taskUuid,
            ],
          }),
        ]);
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update project task.",
          ),
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        taskUuid: string,
      ) => {
        if (!projectUuid) {
          throw new Error(
            "Project UUID is required.",
          );
        }

        return deleteProjectTask(
          projectUuid,
          taskUuid,
        );
      },

      onSuccess: async (
        _data,
        taskUuid,
      ) => {
        notify.success(
          "Project task deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "project-task",
            projectUuid,
            taskUuid,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "project-tasks",
            projectUuid,
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to delete project task.",
          ),
        );
      },
    });

  return {
    projectTasks:
      tasksQuery.data ?? [],

    loading:
      tasksQuery.isLoading,

    fetching:
      tasksQuery.isFetching,

    error:
      tasksQuery.error,

    refetch:
      tasksQuery.refetch,

    fetchProjectTask,

    create:
      createMutation.mutateAsync,

    update: (
      taskUuid: string,
      payload:
        UpdateProjectTaskRequest,
    ) =>
      updateMutation.mutateAsync({
        taskUuid,
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