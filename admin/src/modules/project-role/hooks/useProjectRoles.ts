import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export const useProjectRoles =
  () => {
    const queryClient =
      useQueryClient();

    const rolesQuery =
      useQuery({
        queryKey: [
          "project-roles",
        ],

        queryFn:
          getProjectRoles,

        staleTime:
          5 * 60 * 1000,
      });

    const fetchProjectRole =
      async (
        uuid: string,
      ) => {
        try {
          return await queryClient.fetchQuery({
            queryKey: [
              "project-role",
              uuid,
            ],

            queryFn: () =>
              getProjectRoleByUuid(
                uuid,
              ),
          });
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load project role.",
            ),
          );

          throw error;
        }
      };

    const createMutation =
      useMutation({
        mutationFn: (
          payload:
            CreateProjectRoleRequest,
        ) =>
          createProjectRole(
            payload,
          ),

        onSuccess: async () => {
          notify.success(
            "Project role created successfully.",
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "project-roles",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create project role.",
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
            UpdateProjectRoleRequest;
        }) =>
          updateProjectRole(
            uuid,
            payload,
          ),

        onSuccess: async (
          _data,
          variables,
        ) => {
          notify.success(
            "Project role updated successfully.",
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "project-roles",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "project-role",
                variables.uuid,
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update project role.",
            ),
          );
        },
      });

    const deleteMutation =
      useMutation({
        mutationFn: (
          uuid: string,
        ) =>
          deleteProjectRole(
            uuid,
          ),

        onSuccess: async (
          _data,
          uuid,
        ) => {
          notify.success(
            "Project role deleted successfully.",
          );

          queryClient.removeQueries({
            queryKey: [
              "project-role",
              uuid,
            ],
          });

          await queryClient.invalidateQueries({
            queryKey: [
              "project-roles",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete project role.",
            ),
          );
        },
      });

    return {
      projectRoles:
        rolesQuery.data ?? [],

      loading:
        rolesQuery.isLoading,

      fetching:
        rolesQuery.isFetching,

      error:
        rolesQuery.error,

      refetch:
        rolesQuery.refetch,

      fetchProjectRole,

      create:
        createMutation.mutateAsync,

      update: (
        uuid: string,
        payload:
          UpdateProjectRoleRequest,
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