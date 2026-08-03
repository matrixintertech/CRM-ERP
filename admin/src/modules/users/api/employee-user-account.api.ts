import api from "@/shared/services/axios";

import type {
  UserStatus,
} from "../../employee/types/employee.types";

interface CreateEmployeeUserAccountDto {
  roleUuid: string;

  status?: UserStatus;
}

interface UpdateEmployeeUserAccountDto {
  roleUuid?: string;

  status?: UserStatus;
}

const BASE_URL =
  "/users/employees";

export const createEmployeeUserAccount = async (
  employeeUuid: string,
  payload: CreateEmployeeUserAccountDto,
) => {
  const response =
    await api.post(
      `${BASE_URL}/${employeeUuid}`,
      payload,
    );

  return response.data;
};

export const getEmployeeUserAccount = async (
  employeeUuid: string,
) => {
  const response =
    await api.get(
      `${BASE_URL}/${employeeUuid}`,
    );

  return response.data;
};

export const updateEmployeeUserAccount = async (
  employeeUuid: string,
  payload: UpdateEmployeeUserAccountDto,
) => {
  const response =
    await api.patch(
      `${BASE_URL}/${employeeUuid}`,
      payload,
    );

  return response.data;
};

export const deleteEmployeeUserAccount = async (
  employeeUuid: string,
) => {
  const response =
    await api.delete(
      `${BASE_URL}/${employeeUuid}`,
    );

  return response.data;
};