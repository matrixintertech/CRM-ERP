import api from "@/shared/services/axios";

import type {
  CreateOnboardingDto,
} from "../types/company.types";


interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}


const BASE_URL =
  "/platform/companies";


export const getCompanies = async (
  params: GetCompaniesParams = {},
) => {
  const { data } =
    await api.get(
      BASE_URL,
      {
        params: {
          page:
            params.page ??
            1,

          limit:
            params.limit ??
            10,

          search:
            params.search,

          status:
            params.status,

          type:
            params.type,
        },
      },
    );

  return data.data;
};


export const getCompany = async (
  id: string,
) => {
  const { data } =
    await api.get(
      `${BASE_URL}/${id}`,
    );

  return data.data.company;
};


export const createCompanyOnboarding =
  async (
    payload:
      CreateOnboardingDto,
  ) => {
    const { data } =
      await api.post(
        "/onboarding/company",
        payload,
      );

    return data;
  };