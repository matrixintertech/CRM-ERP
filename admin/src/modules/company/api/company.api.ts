import api from "@/shared/services/axios";

import type { CreateOnboardingDto } from "../types/company.types";

export const getCompanies = async (
  page = 1,
  limit = 10,
) => {
  const { data } = await api.get(
    "/companies",
    {
      params: {
        page,
        limit,
      },
    },
  );

  return data.data;
};


export const getCompany = async (
  id: string,
) => {
  const { data } = await api.get(
    `/companies/${id}`,
  );

  return data.data.company;
};


// Onboarding
export const createCompanyOnboarding = async (
  payload: CreateOnboardingDto,
) => {
  const { data } = await api.post(
    "/onboarding/company",
    payload,
  );

  return data;
};