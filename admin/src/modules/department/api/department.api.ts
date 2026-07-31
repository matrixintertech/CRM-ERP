import api from "@/shared/services/axios";

import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "../types/department.types";

export const createDepartment = async (
  payload: CreateDepartmentDto,
) => {
  const response = await api.post(
    "/departments",
    payload,
  );
  return response.data;
};

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data.data;
};

export const getDepartment = async (
  id: number,
) => {
  const response = await api.get(
    `/departments/${id}`,
  );
  return response.data.data;
};

export const updateDepartment = async (
  id: number,
  payload: UpdateDepartmentDto,
) => {
  const response = await api.patch(
    `/departments/${id}`,
    payload,
  );
  return response.data;
};

export const deleteDepartment = async (
  id: number,
) => {
  const response = await api.delete(
    `/departments/${id}`,
  );
  return response.data;
};