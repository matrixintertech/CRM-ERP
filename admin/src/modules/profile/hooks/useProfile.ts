import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useAuth,
} from "@/app/providers/AuthProvider";

import {
  notify,
} from "@/shared/utils/notify";

import {
  getProfile,
} from "../api/profile.api";


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
   * Authentication state.
   *
   * Profile query sirf authenticated
   * session me run honi chahiye.
   */
  const {
    isAuthenticated,
  } = useAuth();


  /*
   * Global authenticated-user profile.
   *
   * React Query same query key ko
   * poore application me share karega.
   *
   * Includes:
   *
   * - authorizationBoundary
   * - accessPortal
   * - effectivePermissions
   * - displayName
   */
  const profileQuery =
    useQuery({
      queryKey:
        PROFILE_QUERY_KEY,

      queryFn:
        getProfile,

      /*
       * Login ke pehle profile API
       * request nahi chalegi.
       *
       * Login hone par automatically
       * active ho jayegi.
       */
      enabled:
        isAuthenticated,

      staleTime:
        PROFILE_STALE_TIME,

      retry:
        false,

      /*
       * Another browser tab me
       * permissions change hone ke baad
       * focus par fresh profile.
       */
      refetchOnWindowFocus:
        "always",
    });


  /*
   * Profile explicitly load karo.
   *
   * Isko authenticated flows me hi
   * call karna chahiye.
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
   * Useful when current user's:
   *
   * - role permissions
   * - direct permissions
   * - profile/session capabilities
   *
   * change.
   */
  const refreshProfile =
    async () => {
      await queryClient
        .invalidateQueries({
          queryKey:
            PROFILE_QUERY_KEY,

          exact:
            true,
        });


      return queryClient
        .fetchQuery({
          queryKey:
            PROFILE_QUERY_KEY,

          queryFn:
            getProfile,

          /*
           * Invalidated query ko
           * fresh API se load karna hai.
           */
          staleTime:
            0,
        });
    };


  /*
   * Logout/session cleanup.
   *
   * Old user's:
   *
   * - portal
   * - permissions
   * - profile
   *
   * next login me reuse nahi honge.
   */
  const clearProfile =
    () => {
      queryClient.removeQueries({
        queryKey:
          PROFILE_QUERY_KEY,

        exact:
          true,
      });
    };


  return {
    /*
     * Query state.
     */
    loading:
      profileQuery.isLoading,

    fetching:
      profileQuery.isFetching,


    /*
     * Current session profile.
     */
    profile:
      profileQuery.data ??
      null,

    error:
      profileQuery.error,


    /*
     * Query actions.
     */
    refetch:
      profileQuery.refetch,

    fetchProfile,

    refreshProfile,

    clearProfile,
  };
};