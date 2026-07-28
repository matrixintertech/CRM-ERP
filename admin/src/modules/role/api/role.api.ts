import api from "@/shared/services/axios";

import type { RoleFormData } from "../types/role.types";

export const createRole = async (
  payload: RoleFormData,
) => {
  const { data } = await api.post(
    "/roles",
    payload,
  );

  return data;
};

export const getRoles = async (
  companyId: string,
) => {
  const { data } = await api.get(
    `/roles/company/${companyId}`,
  );

  return data.data.roles;
};

export const getRole = async (
  id: string,
) => {
  const { data } = await api.get(
    `/roles/${id}`,
  );

  return data.data.role;
};

export const updateRole = async (
  id: string,
  payload: Partial<RoleFormData>,
) => {
  const { data } = await api.patch(
    `/roles/${id}`,
    payload,
  );

  return data;
};

export const deleteRole = async (
  id: string,
) => {
  const { data } = await api.delete(
    `/roles/${id}`,
  );

  return data;
};