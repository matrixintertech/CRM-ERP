import {
  useCallback,
  useState,
} from "react";

import {
  notify,
} from "@/shared/utils/notify";

import {
  assignProjectMember,
  getProjectMemberByUuid,
  getProjectMembers,
  removeProjectMember,
  updateProjectMember,
} from "../api/project-member.api";

import type {
  AssignProjectMemberRequest,
  ProjectMember,
  UpdateProjectMemberRequest,
} from "../types/project-member.types";

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

export const useProjectMembers = () => {
  const [
    projectMembers,
    setProjectMembers,
  ] = useState<ProjectMember[]>([]);

  const [
    selectedProjectMember,
    setSelectedProjectMember,
  ] =
    useState<ProjectMember | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const fetchProjectMembers =
    useCallback(
      async (
        projectUuid: string,
        includeHistory = false,
      ) => {
        try {
          setLoading(true);

          const data =
            await getProjectMembers(
              projectUuid,
              includeHistory,
            );

          setProjectMembers(
            data,
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load project members.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const fetchProjectMember =
    useCallback(
      async (
        projectUuid: string,
        memberUuid: string,
      ) => {
        try {
          setLoading(true);

          const data =
            await getProjectMemberByUuid(
              projectUuid,
              memberUuid,
            );

          setSelectedProjectMember(
            data,
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load project member.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const assign =
    useCallback(
      async (
        projectUuid: string,
        payload:
          AssignProjectMemberRequest,
      ) => {
        try {
          setLoading(true);

          const data =
            await assignProjectMember(
              projectUuid,
              payload,
            );

          notify.success(
            "Project member assigned successfully.",
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to assign project member.",
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
        memberUuid: string,
        payload:
          UpdateProjectMemberRequest,
      ) => {
        try {
          setLoading(true);

          const data =
            await updateProjectMember(
              projectUuid,
              memberUuid,
              payload,
            );

          notify.success(
            "Project member updated successfully.",
          );

          return data;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update project member.",
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
        memberUuid: string,
      ) => {
        try {
          setLoading(true);

          await removeProjectMember(
            projectUuid,
            memberUuid,
          );

          setProjectMembers(
            (previous) =>
              previous.filter(
                (member) =>
                  member.uuid !==
                  memberUuid,
              ),
          );

          notify.success(
            "Project member removed successfully.",
          );
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to remove project member.",
            ),
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const clearSelectedProjectMember =
    useCallback(() => {
      setSelectedProjectMember(
        null,
      );
    }, []);

  const clearProjectMembers =
    useCallback(() => {
      setProjectMembers([]);
    }, []);

  return {
    projectMembers,
    selectedProjectMember,
    loading,

    fetchProjectMembers,
    fetchProjectMember,

    assign,
    update,
    remove,

    clearSelectedProjectMember,
    clearProjectMembers,
  };
};