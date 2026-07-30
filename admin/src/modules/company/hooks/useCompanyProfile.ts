import { useEffect, useState } from "react";
import { notify } from "@/shared/utils/notify";

import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../api/company-profile.api";

import type {
  CompanyProfile,
  UpdateCompanyProfile,
} from "../types/company-profile.types";

export const useCompanyProfile = () => {
  const [company, setCompany] =
    useState<CompanyProfile | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const fetchCompanyProfile =
    async () => {
      try {
        setLoading(true);

        const response =
          await getCompanyProfile();

        setCompany(response);

        return response;
      } catch (error: any) {
        console.error(
          "Failed to fetch company profile",
          error,
        );

        notify.error(
          error?.response?.data?.message ||
            "Failed to load company profile."
        );

        throw error;
      } finally {
        setLoading(false);
      }
    };

  const saveCompanyProfile =
    async (
      payload: UpdateCompanyProfile,
    ) => {
      try {
        setSaving(true);

        const response =
          await updateCompanyProfile(
            payload,
          );

        setCompany(response);

        notify.success(
          "Company profile updated successfully."
        );

        return response;
      } catch (error: any) {
        console.error(
          "Failed to update company profile",
          error,
        );

        notify.error(
          error?.response?.data?.message ||
            "Failed to update company profile."
        );

        throw error;
      } finally {
        setSaving(false);
      }
    };

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  return {
    company,
    loading,
    saving,
    fetchCompanyProfile,
    saveCompanyProfile,
  };
};