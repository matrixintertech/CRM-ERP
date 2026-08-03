import api from "@/shared/services/axios";

import type {
  CreateDesignationDto,
  Designation,
  UpdateDesignationDto,
} from "../types/designation.types";

export const createDesignation = async (
  payload: CreateDesignationDto,
) => {
  const { data } = await api.post(
    "/designations",
    payload,
  );

  return data.data ?? data;
};

export const getDesignations = async (): Promise<
  Designation[]
> => {
  const { data } = await api.get(
    "/designations",
  );

  return Array.isArray(data.data)
    ? data.data
    : data.data?.designations ?? [];
};

export const getDesignation = async (
  uuid: string,
): Promise<Designation> => {
  const { data } = await api.get(
    `/designations/${uuid}`,
  );

  return data.data?.designation ??
    data.data;
};

export const updateDesignation = async (
  uuid: string,
  payload: UpdateDesignationDto,
) => {
  const { data } = await api.patch(
    `/designations/${uuid}`,
    payload,
  );

  return data;
};

export const deleteDesignation = async (
  uuid: string,
) => {
  const { data } = await api.delete(
    `/designations/${uuid}`,
  );

  return data;
};