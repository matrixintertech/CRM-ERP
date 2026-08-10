import axios from "axios";

import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notify } from "@/shared/utils/notify";

import {
  createPlatformUser,
  deletePlatformUser,
  getPlatformUserByUuid,
  getPlatformUsers,
  updatePlatformUser,
} from "../api/platform-user.api";

import type {
  CreatePlatformUserDto,
  PlatformUser,
  UpdatePlatformUserDto,
} from "../types/platform-user.types";

interface ApiErrorResponse {
  message?: string;
  errors?: string | string[];
}

const PLATFORM_USERS_QUERY_KEY = [
  "platform-users",
] as const;

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (
    axios.isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    const message =
      error.response?.data?.message;

    const errors =
      error.response?.data?.errors;

    if (message) {
      return message;
    }

    if (Array.isArray(errors)) {
      return errors.join(", ");
    }

    if (typeof errors === "string") {
      return errors;
    }
  }

  return fallback;
};

export const usePlatformUsers = () => {
  const queryClient =
    useQueryClient();

  const [
    selectedUserUuid,
    setSelectedUserUuid,
  ] = useState<string | null>(null);

  const usersQuery = useQuery({
    queryKey:
      PLATFORM_USERS_QUERY_KEY,

    queryFn:
      getPlatformUsers,

    staleTime:
      5 * 60 * 1000,
  });

  const selectedUserQuery =
    useQuery({
      queryKey: [
        "platform-user",
        selectedUserUuid,
      ],

      queryFn: () =>
        getPlatformUserByUuid(
          selectedUserUuid!,
        ),

      enabled:
        Boolean(selectedUserUuid),

      staleTime:
        5 * 60 * 1000,
    });

  const createMutation =
    useMutation({
      mutationFn: (
        payload: CreatePlatformUserDto,
      ) =>
        createPlatformUser(
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Platform user created successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey:
            PLATFORM_USERS_QUERY_KEY,
        });
      },

      onError: (error) => {
        console.error(
          "Failed to create platform user:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create platform user.",
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
        payload: UpdatePlatformUserDto;
      }) =>
        updatePlatformUser(
          uuid,
          payload,
        ),

      onSuccess: async (
        _response,
        variables,
      ) => {
        notify.success(
          "Platform user updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              PLATFORM_USERS_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "platform-user",
              variables.uuid,
            ],
          }),
        ]);
      },

      onError: (error) => {
        console.error(
          "Failed to update platform user:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update platform user.",
          ),
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        uuid: string,
      ) =>
        deletePlatformUser(
          uuid,
        ),

      onSuccess: async (
        _response,
        uuid,
      ) => {
        notify.success(
          "Platform user deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "platform-user",
            uuid,
          ],
        });

        if (
          selectedUserUuid === uuid
        ) {
          setSelectedUserUuid(
            null,
          );
        }

        await queryClient.invalidateQueries({
          queryKey:
            PLATFORM_USERS_QUERY_KEY,
        });
      },

      onError: (error) => {
        console.error(
          "Failed to delete platform user:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete platform user.",
          ),
        );
      },
    });

  const fetchUsers =
    async (): Promise<
      PlatformUser[]
    > => {
      try {
        return await queryClient.fetchQuery({
          queryKey:
            PLATFORM_USERS_QUERY_KEY,

          queryFn:
            getPlatformUsers,

          staleTime:
            5 * 60 * 1000,
        });
      } catch (error) {
        console.error(
          "Failed to load platform users:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load platform users.",
          ),
        );

        throw error;
      }
    };

  const fetchUser = async (
    uuid: string,
  ): Promise<PlatformUser> => {
    try {
      const data =
        await queryClient.fetchQuery({
          queryKey: [
            "platform-user",
            uuid,
          ],

          queryFn: () =>
            getPlatformUserByUuid(
              uuid,
            ),

          staleTime:
            5 * 60 * 1000,
        });

      setSelectedUserUuid(
        uuid,
      );

      return data;
    } catch (error) {
      console.error(
        "Failed to load platform user:",
        error,
      );

      notify.error(
        getErrorMessage(
          error,
          "Failed to load platform user.",
        ),
      );

      throw error;
    }
  };

  const clearSelectedUser = () => {
    setSelectedUserUuid(null);
  };

  return {
    users:
      usersQuery.data ?? [],

    selectedUser:
      selectedUserQuery.data ??
      null,

    loading:
      usersQuery.isLoading,

    fetching:
      usersQuery.isFetching,

    detailsLoading:
      selectedUserQuery.isLoading ||
      selectedUserQuery.isFetching,

    error:
      usersQuery.error ??
      selectedUserQuery.error,

    refetch:
      usersQuery.refetch,

    fetchUsers,

    fetchUser,

    create:
      createMutation.mutateAsync,

    update: (
      uuid: string,
      payload: UpdatePlatformUserDto,
    ) =>
      updateMutation.mutateAsync({
        uuid,
        payload,
      }),

    remove:
      deleteMutation.mutateAsync,

    clearSelectedUser,

    saving:
      createMutation.isPending ||
      updateMutation.isPending,

    deleting:
      deleteMutation.isPending,
  };
};