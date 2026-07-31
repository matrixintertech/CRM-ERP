
import { useState } from "react";
import { notify } from "@/shared/utils/notify";

import {
  createDesignation,
  deleteDesignation,
  getDesignation,
  getDesignations,
  updateDesignation,
} from "../api/designation.api";

import type {
  Designation,
  DesignationFormData,
} from "../types/designation.types";

export const useDesignation = () => {
  const [loading, setLoading] =
    useState(false);

  const [
    designations,
    setDesignations,
  ] = useState<Designation[]>([]);

  const [
    selectedDesignation,
    setSelectedDesignation,
  ] = useState<Designation | null>(null);

  const fetchDesignations =
    async () => {
      setLoading(true);

      try {
        const data =
          await getDesignations();

        setDesignations(data);
      } finally {
        setLoading(false);
      }
    };

  const fetchDesignation =
    async (id: string) => {
      setLoading(true);

      try {
        const data =
          await getDesignation(id);

        setSelectedDesignation(data);

        return data;
      } finally {
        setLoading(false);
      }
    };

  const create = async (
    payload: DesignationFormData,
  ) => {
    setLoading(true);

    try {
      const data =
        await createDesignation(payload);

      notify.success(
        "Designation created successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to create designation.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: string,
    payload: Partial<DesignationFormData>,
  ) => {
    setLoading(true);

    try {
      const data =
        await updateDesignation(
          id,
          payload,
        );

      notify.success(
        "Designation updated successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to update designation.",
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
        await deleteDesignation(id);

      notify.success(
        "Designation deleted successfully.",
      );

      return data;
    } catch (error) {
      notify.error(
        "Failed to delete designation.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    designations,

    selectedDesignation,

    fetchDesignations,

    fetchDesignation,

    create,

    update,

    remove,
  };
};