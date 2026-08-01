import api from "@/shared/services/axios";

import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  Department,
  DepartmentQueryParams,
} from "../types/department.types";


export const createDepartment = async (
  payload: CreateDepartmentDto,
) => {
  const { data } =
    await api.post(
      "/departments",
      payload,
    );

  return data.data;
};


export const getDepartments = async (
  params?: DepartmentQueryParams,
): Promise<Department[]> => {
  const { data } = await api.get(
    "/departments",
    {
      params,
    },
  );

  return data.data ?? [];
};


export const getDepartment = async (
  uuid: string,
): Promise<Department> => {
  const { data } = await api.get(
    `/departments/${uuid}`,
  );

  return data.data;
};


export const updateDepartment = async (
  uuid: string,
  payload: UpdateDepartmentDto,
) => {
  const { data } =
    await api.patch(
      `/departments/${uuid}`,
      payload,
    );

  return data;
};


export const deleteDepartment = async (
  uuid: string,
) => {
  const { data } =
    await api.delete(
      `/departments/${uuid}`,
    );

  return data;
};