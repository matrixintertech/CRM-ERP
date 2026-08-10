import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notify } from "@/shared/utils/notify";

import {
  getProfile,
} from "../api/profile.api";

import type {
  UserProfile,
} from "../types/profile.types";

const PROFILE_QUERY_KEY = [
  "profile",
] as const;

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: string[];
      };
    };
  };

  const errors =
    apiError.response?.data?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(", ");
  }

  return (
    apiError.response?.data?.message ??
    fallbackMessage
  );
};

export const useProfile = () => {
  const queryClient =
    useQueryClient();

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,

    queryFn: getProfile,

    staleTime: 5 * 60 * 1000,

    retry: false,
  });

  const fetchProfile =
    async () => {
      try {
        return await queryClient.fetchQuery({
          queryKey:
            PROFILE_QUERY_KEY,

          queryFn:
            getProfile,

          staleTime:
            5 * 60 * 1000,
        });
      } catch (error: unknown) {
        console.error(
          "Failed to load profile:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load profile.",
          ),
        );

        throw error;
      }
    };

  const clearProfile = () => {
    queryClient.setQueryData<
      UserProfile | null
    >(
      PROFILE_QUERY_KEY,
      null,
    );

    queryClient.removeQueries({
      queryKey:
        PROFILE_QUERY_KEY,
    });
  };

  return {
    loading:
      profileQuery.isLoading,

    fetching:
      profileQuery.isFetching,

    profile:
      profileQuery.data ?? null,

    error:
      profileQuery.error,

    refetch:
      profileQuery.refetch,

    fetchProfile,

    clearProfile,
  };
};