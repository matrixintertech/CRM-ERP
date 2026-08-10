import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notify } from "@/shared/utils/notify";

import {
  getCompanies,
  getCompany,
} from "../api/company.api";

import type {
  Company,
  CompanyPagination,
} from "../types/company.types";

interface FetchCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

interface CompaniesResponse {
  companies: Company[];
  pagination: CompanyPagination | null;
}

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

export const useCompanies = (
  params: FetchCompaniesParams = {},
) => {
  const queryClient =
    useQueryClient();

  const queryParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search,
    status: params.status,
    type: params.type,
  };

  const companiesQuery =
    useQuery({
      queryKey: [
        "companies",
        queryParams,
      ],

      queryFn: () =>
        getCompanies(
          queryParams,
        ),

      staleTime:
        5 * 60 * 1000,
    });

  const fetchCompanies =
    async (
      fetchParams: FetchCompaniesParams = {},
    ): Promise<CompaniesResponse> => {
      const resolvedParams = {
        page:
          fetchParams.page ?? 1,

        limit:
          fetchParams.limit ?? 10,

        search:
          fetchParams.search,

        status:
          fetchParams.status,

        type:
          fetchParams.type,
      };

      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "companies",
            resolvedParams,
          ],

          queryFn: () =>
            getCompanies(
              resolvedParams,
            ),

          staleTime:
            5 * 60 * 1000,
        });
      } catch (error) {
        console.error(
          "Failed to load companies:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load companies.",
          ),
        );

        throw error;
      }
    };

  const fetchCompany =
    async (
      id: string,
    ): Promise<Company> => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "company",
            id,
          ],

          queryFn: () =>
            getCompany(id),

          staleTime:
            5 * 60 * 1000,
        });
      } catch (error) {
        console.error(
          "Failed to load company details:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load company details.",
          ),
        );

        throw error;
      }
    };

  const clearSelectedCompany = (
    id?: string,
  ) => {
    if (id) {
      queryClient.removeQueries({
        queryKey: [
          "company",
          id,
        ],
      });

      return;
    }

    queryClient.removeQueries({
      queryKey: [
        "company",
      ],
    });
  };

  return {
    companies:
      companiesQuery.data
        ?.companies ?? [],

    pagination:
      companiesQuery.data
        ?.pagination ?? null,

    loading:
      companiesQuery.isLoading,

    fetching:
      companiesQuery.isFetching,

    error:
      companiesQuery.error,

    refetch:
      companiesQuery.refetch,

    fetchCompanies,

    fetchCompany,

    clearSelectedCompany,
  };
};