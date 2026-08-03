import api from "@/shared/services/axios";

import type {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from "../types/employee.types";

export const createEmployee = async (
  payload: CreateEmployeeDto,
) => {
  const { data } = await api.post(
    "/employees",
    payload,
  );

  return data;
};

export const getEmployees = async (): Promise<
  Employee[]
> => {
  const { data } = await api.get(
    "/employees",
  );

  return Array.isArray(data.data)
    ? data.data
    : data.data?.employees ?? [];
};

export const getEmployee = async (
  uuid: string,
): Promise<Employee> => {
  const { data } = await api.get(
    `/employees/${uuid}`,
  );

  return (
    data.data?.employee ??
    data.data
  );
};

export const updateEmployee = async (
  uuid: string,
  payload: UpdateEmployeeDto,
) => {
  const { data } = await api.patch(
    `/employees/${uuid}`,
    payload,
  );

  return data;
};

export const deleteEmployee = async (
  uuid: string,
) => {
  const { data } = await api.delete(
    `/employees/${uuid}`,
  );

  return data;
};