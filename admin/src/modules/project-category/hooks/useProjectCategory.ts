import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  createProjectCategory,
  deleteProjectCategory,
  getProjectCategoryByUuid,
  getProjectCategories,
  updateProjectCategory,
} from "../api/project-category.api";

import type {
  CreateProjectCategoryDto,
  UpdateProjectCategoryDto,
} from "../types/project-category.types";

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

export const useProjectCategories =
  () => {
    const queryClient =
      useQueryClient();

    const categoriesQuery =
      useQuery({
        queryKey: [
          "project-categories",
        ],

        queryFn:
          getProjectCategories,

        staleTime:
          5 * 60 * 1000,
      });

    const fetchCategory =
      async (
        uuid: string,
      ) => {
        try {
          const data =
            await queryClient.fetchQuery({
              queryKey: [
                "project-category",
                uuid,
              ],

              queryFn: () =>
                getProjectCategoryByUuid(
                  uuid,
                ),
            });

          return data.category;
        } catch (error) {
          notify.error(
            getErrorMessage(
              error,
              "Failed to load project category.",
            ),
          );

          throw error;
        }
      };

    const createMutation =
      useMutation({
        mutationFn: (
          payload:
            CreateProjectCategoryDto,
        ) =>
          createProjectCategory(
            payload,
          ),

        onSuccess: async () => {
          notify.success(
            "Project category created successfully.",
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "project-categories",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to create project category.",
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
            UpdateProjectCategoryDto;
        }) =>
          updateProjectCategory(
            uuid,
            payload,
          ),

        onSuccess: async (
          _data,
          variables,
        ) => {
          notify.success(
            "Project category updated successfully.",
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "project-categories",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "project-category",
                variables.uuid,
              ],
            }),
          ]);
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to update project category.",
            ),
          );
        },
      });

    const deleteMutation =
      useMutation({
        mutationFn: (
          uuid: string,
        ) =>
          deleteProjectCategory(
            uuid,
          ),

        onSuccess: async (
          _data,
          uuid,
        ) => {
          notify.success(
            "Project category deleted successfully.",
          );

          queryClient.removeQueries({
            queryKey: [
              "project-category",
              uuid,
            ],
          });

          await queryClient.invalidateQueries({
            queryKey: [
              "project-categories",
            ],
          });
        },

        onError: (error) => {
          notify.error(
            getErrorMessage(
              error,
              "Failed to delete project category.",
            ),
          );
        },
      });

    return {
      categories:
        categoriesQuery.data
          ?.categories ?? [],

      loading:
        categoriesQuery.isLoading,

      fetching:
        categoriesQuery.isFetching,

      error:
        categoriesQuery.error,

      refetch:
        categoriesQuery.refetch,

      fetchCategory,

      create:
        createMutation.mutateAsync,

      update: (
        uuid: string,
        payload:
          UpdateProjectCategoryDto,
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