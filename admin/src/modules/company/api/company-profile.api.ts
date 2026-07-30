import api from "@/shared/services/axios";
import type{ CompanyProfile } from "../types/company-profile.types";

export const getCompanyProfile = async (): Promise<CompanyProfile> => {
  const response = await api.get("/companies/profile");

  return response.data.data;
};

export const updateCompanyProfile = async (
  payload: Partial<CompanyProfile>,
) => {
  const { data } = await api.patch(
    "/companies/profile",
    payload,
  );

 return data.data;
};