import {
  useCallback,
  useState,
} from "react";

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

  const [
    employees,
    setEmployees,
  ] = useState<Employee[]>([]);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<Employee | null>(
    null,
  );

  const fetchEmployees =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getEmployees();

        setEmployees(
          Array.isArray(data)
            ? data
            : [],
        );

        return data;
      } catch (error: any) {
        notify.error(
          error?.response?.data
            ?.message ??
            "Failed to load employees.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchEmployee =
    useCallback(
      async (
        uuid: string,
      ) => {
        setLoading(true);

        try {
          const data =
            await getEmployee(
              uuid,
            );

          setSelectedEmployee(
            data,
          );

          return data;
        } catch (error: any) {
          notify.error(
            error?.response?.data
              ?.message ??
              "Failed to load employee.",
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const create = async (
    payload: CreateEmployeeDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await createEmployee(
          payload,
        );

      notify.success(
        data?.message ??
          "Employee created successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
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
        data?.message ??
          "Employee updated successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
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
        await deleteEmployee(
          uuid,
        );

      setEmployees(
        (previous) =>
          previous.filter(
            (employee) =>
              employee.uuid !== uuid,
          ),
      );

      if (
        selectedEmployee?.uuid ===
        uuid
      ) {
        setSelectedEmployee(
          null,
        );
      }

      notify.success(
        data?.message ??
          "Employee deleted successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
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