import api from "@/shared/services/axios";

import type {
  CreateDesignationDto,
  UpdateDesignationDto,
} from "../types/designation.types";

export const createDesignation = async (
  payload: CreateDesignationDto,
) => {
  const { data } = await api.post(
    "/designations",
    payload,
  );

  return data;
};

export const getDesignations = async () => {
  const { data } = await api.get(
    "/designations",
  );

  return data.data.designations;
};

export const getDesignation = async (
  id: string,
) => {
  const { data } = await api.get(
    `/designations/${id}`,
  );

  return data.data.designation;
};

export const updateDesignation = async (
  id: string,
  payload: Partial<UpdateDesignationDto>,
) => {
  const { data } = await api.patch(
    `/designations/${id}`,
    payload,
  );

  return data;
};

export const deleteDesignation = async (
  id: string,
) => {
  const { data } = await api.delete(
    `/designations/${id}`,
  );

  return data;
};