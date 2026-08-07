import {
  useCallback,
  useState,
} from "react";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createProjectRole,
  deleteProjectRole,
  getProjectRoleByUuid,
  getProjectRoles,
  updateProjectRole,
} from "../api/project-role.api";

import type {
  CreateProjectRoleRequest,
  ProjectRole,
  UpdateProjectRoleRequest,
} from "../types/project-role.types";

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

export const useProjectRoles = () => {
  const [
    projectRoles,
    setProjectRoles,
  ] = useState<ProjectRole[]>([]);

  const [
    selectedProjectRole,
    setSelectedProjectRole,
  ] =
    useState<ProjectRole | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const fetchProjectRoles =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getProjectRoles();

        setProjectRoles(data);

        return data;
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load project roles.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

const fetchProjectRole =
  useCallback(
    async (
      uuid: string,
    ) => {
      try {
        setLoading(true);

        const data =
          await getProjectRoleByUuid(
            uuid,
          );

        setSelectedProjectRole(
          data,
        );

        return data;
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load project role.",
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
        payload:
          CreateProjectRoleRequest,
      ) => {
        try {
          setLoading(true);

          const data =
            await createProjectRole(
              payload,
            );

          notify.success(
            "Project role created successfully.",
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create project role.",
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
        uuid: string,
        payload:
          UpdateProjectRoleRequest,
      ) => {
        try {
          setLoading(true);

          const data =
            await updateProjectRole(
              uuid,
              payload,
            );

          notify.success(
            "Project role updated successfully.",
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update project role.",
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
        uuid: string,
      ) => {
        try {
          setLoading(true);

          await deleteProjectRole(
            uuid,
          );

          setProjectRoles(
            (previous) =>
              previous.filter(
                (role) =>
                  role.uuid !==
                  uuid,
              ),
          );

          notify.success(
            "Project role deleted successfully.",
          );
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete project role.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const clearSelectedProjectRole =
    useCallback(() => {
      setSelectedProjectRole(
        null,
      );
    }, []);

  return {
    projectRoles,
    selectedProjectRole,
    loading,

    fetchProjectRoles,
    fetchProjectRole,

    create,
    update,
    remove,

    clearSelectedProjectRole,
  };
};