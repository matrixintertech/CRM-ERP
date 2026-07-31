import { useState } from "react";
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
  ] = useState<Department | null>(null);

  const fetchDepartments =
    async () => {
      setLoading(true);

      try {
        const data =
          await getDepartments();

        setDepartments(data);
      } finally {
        setLoading(false);
      }
    };

  const fetchDepartment =
    async (id: string) => {
      setLoading(true);

      try {
        const data =
          await getDepartment(id);

        setSelectedDepartment(data);

        return data;
      } finally {
        setLoading(false);
      }
    };

  const create = async (
    payload: DepartmentFormData,
  ) => {
    setLoading(true);

    try {
      const data =
        await createDepartment(payload);

      notify.success(
        "Department created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create department.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: string,
    payload: Partial<DepartmentFormData>,
  ) => {
    setLoading(true);

    try {
      const data =
        await updateDepartment(
          id,
          payload,
        );

      notify.success(
        "Department updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update department.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (
    id: string,
  ) => {
    setLoading(true);

    try {
      const data =
        await deleteDepartment(id);

      notify.success(
        "Department deleted successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
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