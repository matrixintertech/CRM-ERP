import api from "@/shared/services/axios";

import type {
  CompanyProfile,
} from "../types/company-profile.types";


const BASE_URL =
  "/companies/profile";


export const getCompanyProfile =
  async (): Promise<CompanyProfile> => {
    const response =
      await api.get(
        BASE_URL,
      );

    return response.data.data;
  };


export const updateCompanyProfile =
  async (
    payload:
      Partial<CompanyProfile>,
  ) => {
    const { data } =
      await api.patch(
        BASE_URL,
        payload,
      );

    return data.data;
  };