import api from "@/shared/services/axios";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
  OrganizationUnitQueryParams,
  UpdateOrganizationUnitDto,
} from "../types/organization-unit.types";

interface OrganizationUnitListResponse {
  organizationUnits: OrganizationUnit[];
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface OrganizationUnitDetailsResponse {
  organizationUnit: OrganizationUnit;
}

export const createOrganizationUnit = async (
  payload: OrganizationUnitFormData,
) => {
  const { data } = await api.post(
    "/organization-units",
    payload,
  );

  return data;
};

export const getOrganizationUnits = async (
  params: OrganizationUnitQueryParams = {},
): Promise<OrganizationUnitListResponse> => {
  const { data } = await api.get(
    "/organization-units",
    {
      params,
    },
  );

  return data.data;
};

export const getOrganizationUnit = async (
  uuid: string,
): Promise<OrganizationUnit> => {
  const { data } = await api.get(
    `/organization-units/${uuid}`,
  );

  return (
    data.data as OrganizationUnitDetailsResponse
  ).organizationUnit;
};

export const updateOrganizationUnit = async (
  uuid: string,
  payload: UpdateOrganizationUnitDto,
) => {
  const { data } = await api.patch(
    `/organization-units/${uuid}`,
    payload,
  );

  return data;
};

export const deleteOrganizationUnit = async (
  uuid: string,
) => {
  const { data } = await api.delete(
    `/organization-units/${uuid}`,
  );

  return data;
};

export const getOrganizationUnitDropdown =
  async (
    companyUuid?: string,
  ): Promise<OrganizationUnit[]> => {
    const { data } = await api.get(
      "/organization-units/dropdown",
      {
        params: {
          companyUuid,
          status: "ACTIVE",
        },
      },
    );

    return data.data.organizationUnits;
  };