import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notify } from "@/shared/utils/notify";

import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../api/company-profile.api";

import type {
  CompanyProfile,
  UpdateCompanyProfile,
} from "../types/company-profile.types";

const COMPANY_PROFILE_QUERY_KEY = [
  "company-profile",
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

export const useCompanyProfile = () => {
  const queryClient = useQueryClient();

  const companyQuery = useQuery({
    queryKey: COMPANY_PROFILE_QUERY_KEY,

    queryFn: getCompanyProfile,

    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (
      payload: UpdateCompanyProfile,
    ) =>
      updateCompanyProfile(
        payload,
      ),

    onSuccess: (
      response: CompanyProfile,
    ) => {
      queryClient.setQueryData(
        COMPANY_PROFILE_QUERY_KEY,
        response,
      );

      notify.success(
        "Company profile updated successfully.",
      );
    },

    onError: (error) => {
      console.error(
        "Failed to update company profile",
        error,
      );

      notify.error(
        getErrorMessage(
          error,
          "Failed to update company profile.",
        ),
      );
    },
  });

  const fetchCompanyProfile =
    async () => {
      try {
        return await queryClient.fetchQuery({
          queryKey:
            COMPANY_PROFILE_QUERY_KEY,

          queryFn:
            getCompanyProfile,

          staleTime:
            5 * 60 * 1000,
        });
      } catch (error) {
        console.error(
          "Failed to fetch company profile",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load company profile.",
          ),
        );

        throw error;
      }
    };

  const saveCompanyProfile = (
    payload: UpdateCompanyProfile,
  ) =>
    updateMutation.mutateAsync(
      payload,
    );

  return {
    company:
      companyQuery.data ?? null,

    loading:
      companyQuery.isLoading,

    fetching:
      companyQuery.isFetching,

    saving:
      updateMutation.isPending,

    error:
      companyQuery.error ??
      updateMutation.error,

    refetch:
      companyQuery.refetch,

    fetchCompanyProfile,

    saveCompanyProfile,
  };
};