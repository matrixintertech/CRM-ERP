import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export const useProjectMembers = (
  projectUuid?: string,
  enabled = true,
) => {
  const queryClient =
    useQueryClient();

  const membersQuery =
    useQuery({
      queryKey: [
        "project-members",
        projectUuid,
      ],

      queryFn: () =>
        getProjectMembers(
          projectUuid!,
        ),

      enabled:
        Boolean(
          projectUuid,
        ) &&
        enabled,
    });

  const fetchProjectMember =
    async (
      memberUuid: string,
    ) => {
      if (!projectUuid) {
        throw new Error(
          "Project UUID is required.",
        );
      }

      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "project-member",
            projectUuid,
            memberUuid,
          ],

          queryFn: () =>
            getProjectMemberByUuid(
              projectUuid,
              memberUuid,
            ),
        });
      } catch (error) {
        notify.error(
          getErrorMessage(
            error,
            "Failed to load project member.",
          ),
        );

        throw error;
      }
    };

  const assignMutation =
    useMutation({
      mutationFn: (
        payload:
          AssignProjectMemberRequest,
      ) => {
        if (!projectUuid) {
          throw new Error(
            "Project UUID is required.",
          );
        }

        return assignProjectMember(
          projectUuid,
          payload,
        );
      },

      onSuccess: async () => {
        notify.success(
          "Project member assigned successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "project-members",
            projectUuid,
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to assign project member.",
          ),
        );
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        memberUuid,
        payload,
      }: {
        memberUuid: string;
        payload:
          UpdateProjectMemberRequest;
      }) => {
        if (!projectUuid) {
          throw new Error(
            "Project UUID is required.",
          );
        }

        return updateProjectMember(
          projectUuid,
          memberUuid,
          payload,
        );
      },

      onSuccess: async (
        _data,
        variables,
      ) => {
        notify.success(
          "Project member updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "project-members",
              projectUuid,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "project-member",
              projectUuid,
              variables.memberUuid,
            ],
          }),
        ]);
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to update project member.",
          ),
        );
      },
    });

  const removeMutation =
    useMutation({
      mutationFn: (
        memberUuid: string,
      ) => {
        if (!projectUuid) {
          throw new Error(
            "Project UUID is required.",
          );
        }

        return removeProjectMember(
          projectUuid,
          memberUuid,
        );
      },

      onSuccess: async (
        _data,
        memberUuid,
      ) => {
        notify.success(
          "Project member removed successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "project-member",
            projectUuid,
            memberUuid,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "project-members",
            projectUuid,
          ],
        });
      },

      onError: (error) => {
        notify.error(
          getErrorMessage(
            error,
            "Failed to remove project member.",
          ),
        );
      },
    });

  return {
    projectMembers:
      membersQuery.data ?? [],

    loading:
      membersQuery.isLoading,

    fetching:
      membersQuery.isFetching,

    error:
      membersQuery.error,

    refetch:
      membersQuery.refetch,

    fetchProjectMember,

    assign:
      assignMutation.mutateAsync,

    update: (
      memberUuid: string,
      payload:
        UpdateProjectMemberRequest,
    ) =>
      updateMutation.mutateAsync({
        memberUuid,
        payload,
      }),

    remove:
      removeMutation.mutateAsync,

    saving:
      assignMutation.isPending ||
      updateMutation.isPending,

    deleting:
      removeMutation.isPending,
  };
};