import api from "@/shared/services/axios";

import type {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/employee.types";

export const createEmployee = async (
  payload: CreateEmployeeDto,
) => {
  const response = await api.post(
    "/employees",
    payload,
  );

  return response.data;
};

export const getEmployees = async () => {
  const response = await api.get("/employees");

  return response.data.data;
};

export const getEmployee = async (
  uuid: string,
) => {
  const response = await api.get(
    `/employees/${uuid}`,
  );

  return response.data.data;
};

export const updateEmployee = async (
  uuid: string,
  payload: UpdateEmployeeDto,
) => {
  const response = await api.patch(
    `/employees/${uuid}`,
    payload,
  );

  return response.data;
};

export const deleteEmployee = async (
  uuid: string,
) => {
  const response = await api.delete(
    `/employees/${uuid}`,
  );

  return response.data;
};