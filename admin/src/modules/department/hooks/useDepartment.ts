import {
  useCallback,
  useState,
} from "react";

import { notify } from "@/shared/utils/notify";

import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from "../api/department.api";

import type {
  Department,
  DepartmentFormData,
  UpdateDepartmentDto,
} from "../types/department.types";

export const useDepartment = () => {
  const [loading, setLoading] =
    useState(false);

  const [
    departments,
    setDepartments,
  ] = useState<Department[]>([]);

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] =
    useState<Department | null>(null);

  const fetchDepartments =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getDepartments();

        setDepartments(
          Array.isArray(data)
            ? data
            : [],
        );

        return data;
      } catch (error: any) {
        notify.error(
          error?.response?.data
            ?.message ??
            "Failed to load departments.",
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchDepartment =
    useCallback(
      async (
        uuid: string,
      ) => {
        setLoading(true);

        try {
          const data =
            await getDepartment(
              uuid,
            );

          setSelectedDepartment(
            data,
          );

          return data;
        } catch (error: any) {
          notify.error(
            error?.response?.data
              ?.message ??
              "Failed to load department.",
          );

          throw error;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const create = async (
    payload: DepartmentFormData,
  ) => {
    setLoading(true);

    try {
      const data =
        await createDepartment(
          payload,
        );

      notify.success(
        data?.message ??
          "Department created successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
          "Failed to create department.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    uuid: string,
    payload: UpdateDepartmentDto,
  ) => {
    setLoading(true);

    try {
      const data =
        await updateDepartment(
          uuid,
          payload,
        );

      notify.success(
        data?.message ??
          "Department updated successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
          "Failed to update department.",
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
        await deleteDepartment(
          uuid,
        );

      setDepartments(
        (previous) =>
          previous.filter(
            (department) =>
              department.uuid !==
              uuid,
          ),
      );

      notify.success(
        data?.message ??
          "Department deleted successfully.",
      );

      return data;
    } catch (error: any) {
      notify.error(
        error?.response?.data
          ?.message ??
          "Failed to delete department.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    departments,
    selectedDepartment,

    fetchDepartments,
    fetchDepartment,

    create,
    update,
    remove,
  };
};