import api from "@/shared/services/axios";

import type { OrganizationUnitFormData, UpdateOrganizationUnitDto } from "../types/organization-unit.types";

export const createOrganizationUnit =
  async (
    payload: OrganizationUnitFormData,
  ) => {

    console.log("Payload:", payload);
    const { data } =
      await api.post(
        "/organization-units",
        payload,
      );

    return data;
  };


export const getOrganizationUnits = async () => {
  const { data } = await api.get(
    "/organization-units",
  );

  return data.data.organizationUnits;
};


  export const getOrganizationUnit = async (
  id: number,
) => {
  const { data } = await api.get(
    `/organization-units/${id}`,
  );

  return data.data.organizationUnit;
};


  export const updateOrganizationUnit =
  async (
    id: number,
    payload: UpdateOrganizationUnitDto,
  ) => {
    const { data } = await api.patch(
      `/organization-units/${id}`,
      payload,
    );

    return data;
  };