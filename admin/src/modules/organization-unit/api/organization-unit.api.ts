import api from "@/shared/services/axios";

import type { OrganizationUnitFormData } from "../types/organization-unit.types";

export const createOrganizationUnit =
  async (
    payload: OrganizationUnitFormData,
  ) => {
    const { data } =
      await api.post(
        "/organization-units",
        payload,
      );

    return data;
  };


export const getOrganizationUnits =
  async (companyId: string) => {
    const { data } = await api.get(
      `/organization-units/company/${companyId}`,
    );

    return data.data.organizationUnits;
  };