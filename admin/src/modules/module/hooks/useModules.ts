import { useCallback, useState } from "react";

import { notify } from "@/shared/utils/notify";

import {
  createModule,
  deleteModule,
  getModules,
  updateModule,
} from "../api/module.api";

import type {
  Module,
  ModuleFormData,
} from "../types/module.types";

export const useModule = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: any) => {
    const errors = error?.response?.data?.errors;

    if (Array.isArray(errors) && errors.length > 0) {
      return errors.join("\n");
    }

    return (
      error?.response?.data?.message ??
      "Something went wrong."
    );
  };

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getModules();

      setModules(result);
    } catch (error: any) {
      console.error("Failed to fetch modules:", error);

      notify.error(getErrorMessage(error));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload: ModuleFormData) => {
      try {
        setLoading(true);

        const response = await createModule(payload);

        notify.success(
          response.message ??
            "Module created successfully.",
        );

        return response;
      } catch (error: any) {
        console.error(
          "Failed to create module:",
          error,
        );

        notify.error(getErrorMessage(error));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      id: string,
      payload: Partial<ModuleFormData>,
    ) => {
      try {
        setLoading(true);

        const response = await updateModule(
          id,
          payload,
        );

        notify.success(
          response.message ??
            "Module updated successfully.",
        );

        return response;
      } catch (error: any) {
        console.error(
          "Failed to update module:",
          error,
        );

        notify.error(getErrorMessage(error));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        const response = await deleteModule(id);

        notify.success(
          response.message ??
            "Module deleted successfully.",
        );

        return response;
      } catch (error: any) {
        console.error(
          "Failed to delete module:",
          error,
        );

        notify.error(getErrorMessage(error));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    modules,
    fetchModules,
    create,
    update,
    remove,
  };
};