import { useEffect, useState } from "react";

import {
  getCompanies,
  getCompany,
} from "../api/company.api";

export const useCompanies = () => {
  const [companies, setCompanies] =
    useState([]);

  const [pagination, setPagination] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const fetchCompanies = async (
    page = 1,
  ) => {
    try {
      setLoading(true);

      const response =
        await getCompanies(page);

      setCompanies(
        response.companies,
      );

      setPagination(
        response.pagination,
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCompany = async (
    id: string,
  ) => {
    try {
      setDetailsLoading(true);

      const company =
        await getCompany(id);

      setSelectedCompany(company);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    pagination,
    loading,

    selectedCompany,
    detailsLoading,

    fetchCompanies,
    fetchCompany,
  };
};