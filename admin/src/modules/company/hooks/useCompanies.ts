import {
  useCallback,
  useEffect,
  useState,
} from "react";

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

export const useCompanies = () => {
  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [pagination, setPagination] =
    useState<CompanyPagination | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  const [
    selectedCompany,
    setSelectedCompany,
  ] = useState<Company | null>(null);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(false);

  const fetchCompanies = useCallback(
    async (
      params: FetchCompaniesParams = {},
    ) => {
      try {
        setLoading(true);

        const response =
          await getCompanies({
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            search: params.search,
            status: params.status,
            type: params.type,
          });

        setCompanies(
          response.companies ?? [],
        );

        setPagination(
          response.pagination ?? null,
        );

        return response;
      } catch (error: unknown) {
        console.error(
          "Failed to load companies:",
          error,
        );

        notify.error(
          "Failed to load companies.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchCompany = useCallback(
    async (id: string) => {
      try {
        setDetailsLoading(true);

        const company =
          await getCompany(id);

        setSelectedCompany(company);

        return company;
      } catch (error: unknown) {
        console.error(
          "Failed to load company details:",
          error,
        );

        notify.error(
          "Failed to load company details.",
        );

        throw error;
      } finally {
        setDetailsLoading(false);
      }
    },
    [],
  );

  const clearSelectedCompany =
    useCallback(() => {
      setSelectedCompany(null);
    }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    pagination,
    loading,

    selectedCompany,
    detailsLoading,

    fetchCompanies,
    fetchCompany,
    clearSelectedCompany,
  };
};