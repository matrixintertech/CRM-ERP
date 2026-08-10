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

interface ApiErrorResponse {
  message?: string;

  errors?:
    | string
    | string[];
}

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  const apiError =
    error as {
      response?: {
        data?: ApiErrorResponse;
      };
    };

  const message =
    apiError.response
      ?.data?.message;

  const errors =
    apiError.response
      ?.data?.errors;

  if (message) {
    return message;
  }

  if (
    Array.isArray(errors)
  ) {
    return errors.join(
      ", ",
    );
  }

  if (
    typeof errors ===
    "string"
  ) {
    return errors;
  }

  return fallbackMessage;
};

export const useUsers = (
  params:
    UserQueryParams = {},
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

      staleTime:
        5 * 60 * 1000,
    });

  const fetchUser =
    async (
      uuid: string,
    ) => {
      try {
        return await queryClient
          .fetchQuery({
            queryKey: [
              "user",
              uuid,
            ],

            queryFn: () =>
              getUserByUuid(
                uuid,
              ),

            staleTime:
              5 * 60 * 1000,
          });
      } catch (error) {
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
        return await queryClient
          .fetchQuery({
            queryKey: [
              "user-permissions",
              uuid,
            ],

            queryFn: () =>
              getUserPermissions(
                uuid,
              ),

            staleTime:
              5 * 60 * 1000,
          });
      } catch (error) {
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

        await queryClient
          .invalidateQueries({
            queryKey: [
              "user-permissions",
              variables.uuid,
            ],
          });
      },

      onError: (
        error,
      ) => {
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

  const pagination =
    response?.pagination;

  return {
    users:
      response?.users ??
      [],

    pagination:
      pagination ??
      null,

    total:
      pagination?.total ??
      0,

    page:
      pagination?.page ??
      params.page ??
      1,

    limit:
      pagination?.limit ??
      params.limit ??
      10,

    totalPages:
      pagination?.totalPages ??
      1,

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
      permissionsMutation
        .mutateAsync({
          uuid,
          payload,
        }),

    savingPermissions:
      permissionsMutation
        .isPending,
  };
};