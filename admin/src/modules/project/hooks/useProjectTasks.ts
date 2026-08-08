import {
  useCallback,
  useState,
} from "react";

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
  ProjectTask,
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

export const useProjectTasks = () => {
  const [
    projectTasks,
    setProjectTasks,
  ] = useState<ProjectTask[]>([]);

  const [
    selectedProjectTask,
    setSelectedProjectTask,
  ] =
    useState<ProjectTask | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const fetchProjectTasks =
    useCallback(
      async (
        projectUuid: string,
      ) => {
        try {
          setLoading(true);

          const data =
            await getProjectTasks(
              projectUuid,
            );

          setProjectTasks(
            data,
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load project tasks.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const fetchProjectTask =
    useCallback(
      async (
        projectUuid: string,
        taskUuid: string,
      ) => {
        try {
          setLoading(true);

          const data =
            await getProjectTaskByUuid(
              projectUuid,
              taskUuid,
            );

          setSelectedProjectTask(
            data,
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load project task.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const create =
    useCallback(
      async (
        projectUuid: string,
        payload:
          CreateProjectTaskRequest,
      ) => {
        try {
          setLoading(true);

          const data =
            await createProjectTask(
              projectUuid,
              payload,
            );

          notify.success(
            "Project task created successfully.",
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create project task.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const update =
    useCallback(
      async (
        projectUuid: string,
        taskUuid: string,
        payload:
          UpdateProjectTaskRequest,
      ) => {
        try {
          setLoading(true);

          const data =
            await updateProjectTask(
              projectUuid,
              taskUuid,
              payload,
            );

          notify.success(
            "Project task updated successfully.",
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update project task.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const remove =
    useCallback(
      async (
        projectUuid: string,
        taskUuid: string,
      ) => {
        try {
          setLoading(true);

          await deleteProjectTask(
            projectUuid,
            taskUuid,
          );

          setProjectTasks(
            (previous) =>
              previous.filter(
                (task) =>
                  task.uuid !==
                  taskUuid,
              ),
          );

          if (
            selectedProjectTask
              ?.uuid === taskUuid
          ) {
            setSelectedProjectTask(
              null,
            );
          }

          notify.success(
            "Project task deleted successfully.",
          );
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete project task.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [
        selectedProjectTask,
      ],
    );

  const clearSelectedProjectTask =
    useCallback(() => {
      setSelectedProjectTask(
        null,
      );
    }, []);

  const clearProjectTasks =
    useCallback(() => {
      setProjectTasks([]);
    }, []);

  return {
    projectTasks,
    selectedProjectTask,
    loading,

    fetchProjectTasks,
    fetchProjectTask,

    create,
    update,
    remove,

    clearSelectedProjectTask,
    clearProjectTasks,
  };
};