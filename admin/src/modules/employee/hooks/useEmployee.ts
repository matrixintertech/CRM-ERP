import { useState } from "react";
import { notify } from "@/shared/utils/notify";

import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../api/employee.api";

import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/employee.types";

export const useEmployee = () => {
  const [loading, setLoading] =
    useState(false);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<Employee | null>(null);

  const fetchEmployees =
    async () => {
      setLoading(true);

      try {
        const data =
          await getEmployees();

        setEmployees(data);
      } finally {
        setLoading(false);
      }
    };

  const fetchEmployee =
    async (uuid: string) => {
      setLoading(true);

      try {
        const data =
          await getEmployee(uuid);

        setSelectedEmployee(data);

        return data;
      } finally {
        setLoading(false);
      }
    };

  const create = async (
    payload: CreateEmployeeDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await createEmployee(payload);

      notify.success(
        "Employee created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create employee.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    uuid: string,
    payload: UpdateEmployeeDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await updateEmployee(
          uuid,
          payload,
        );

      notify.success(
        "Employee updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update employee.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    uuid: string,
  ) => {
    setLoading(true);

    try {
      const data =
        await deleteEmployee(uuid);

      notify.success(
        "Employee deleted successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to delete employee.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    employees,

    selectedEmployee,

    fetchEmployees,

    fetchEmployee,

    create,

    update,

    remove,
  };
};