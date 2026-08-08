import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  getUsers,
  getUserByUuid,
  getUserPermissions,
  updateUserPermissions,
} from "../api/user.api";

import type {
  UpdateUserPermissionsDto,
  UserQueryParams,
} from "../types/user.types";

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?: string;
          errors?: string[];
        };
      };
    };

  const errors =
    apiError.response?.data
      ?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(
      ", ",
    );
  }

  return (
    apiError.response?.data
      ?.message ??
    fallbackMessage
  );
};

export const useUsers = (
  params: UserQueryParams = {},
) => {
  const queryClient =
    useQueryClient();

  const usersQuery =
    useQuery({
      queryKey: [
        "users",
        params,
      ],

      queryFn: () =>
        getUsers(
          params,
        ),
    });

  const fetchUser =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "user",
            uuid,
          ],

          queryFn: () =>
            getUserByUuid(
              uuid,
            ),
        });
      } catch (error) {
        console.error(
          "Failed to load user:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load user.",
          ),
        );

        throw error;
      }
    };

  const fetchPermissions =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "user-permissions",
            uuid,
          ],

          queryFn: () =>
            getUserPermissions(
              uuid,
            ),
        });
      } catch (error) {
        console.error(
          "Failed to load user permissions:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load user permissions.",
          ),
        );

        throw error;
      }
    };

  const permissionsMutation =
    useMutation({
      mutationFn: ({
        uuid,
        payload,
      }: {
        uuid: string;

        payload:
          UpdateUserPermissionsDto;
      }) =>
        updateUserPermissions(
          uuid,
          payload,
        ),

      onSuccess: async (
        _response,
        variables,
      ) => {
        notify.success(
          "User permissions updated successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey: [
            "user-permissions",
            variables.uuid,
          ],
        });
      },

      onError: (error) => {
        console.error(
          "Failed to update user permissions:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update user permissions.",
          ),
        );
      },
    });

  const response =
    usersQuery.data;

  return {
    users:
      response?.users ?? [],

    total:
      response?.total ?? 0,

    page:
      response?.page ?? 1,

    limit:
      response?.limit ?? 10,

    totalPages:
      response?.totalPages ?? 0,

    loading:
      usersQuery.isLoading,

    fetching:
      usersQuery.isFetching,

    error:
      usersQuery.error,

    refetch:
      usersQuery.refetch,

    fetchUser,

    fetchPermissions,

    savePermissions: (
      uuid: string,
      payload:
        UpdateUserPermissionsDto,
    ) =>
      permissionsMutation.mutateAsync({
        uuid,
        payload,
      }),

    savingPermissions:
      permissionsMutation.isPending,
  };
};