import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  notify,
} from "@/shared/utils/notify";

import {
  getProfile,
} from "../api/profile.api";

import type {
  UserProfile,
} from "../types/profile.types";


export const PROFILE_QUERY_KEY = [
  "profile",
] as const;


const PROFILE_STALE_TIME =
  5 * 60 * 1000;


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


  /*
   * Global authenticated-user profile.
   *
   * React Query same query key ko
   * poore application me share karega.
   *
   * Isme effectivePermissions bhi
   * available hongi.
   */
  const profileQuery =
    useQuery({
      queryKey:
        PROFILE_QUERY_KEY,

      queryFn:
        getProfile,

      staleTime:
        PROFILE_STALE_TIME,

      retry:
        false,
    });


  /*
   * Profile ko explicitly load karo.
   *
   * Fresh cache available hai to
   * unnecessary API request nahi hogi.
   */
  const fetchProfile =
    async () => {
      try {
        return await queryClient
          .fetchQuery({
            queryKey:
              PROFILE_QUERY_KEY,

            queryFn:
              getProfile,

            staleTime:
              PROFILE_STALE_TIME,
          });
      } catch (
        error: unknown
      ) {
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


  /*
   * Force fresh profile.
   *
   * Useful when current logged-in
   * user's role/direct permissions
   * change.
   */
  const refreshProfile =
    async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            PROFILE_QUERY_KEY,
        });

      return queryClient
        .fetchQuery({
          queryKey:
            PROFILE_QUERY_KEY,

          queryFn:
            getProfile,

          staleTime:
            PROFILE_STALE_TIME,
        });
    };


  /*
   * Logout/session cleanup.
   */
  const clearProfile = () => {
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
      profileQuery.data ??
      null,

    error:
      profileQuery.error,

    refetch:
      profileQuery.refetch,

    fetchProfile,

    refreshProfile,

    clearProfile,
  };
};