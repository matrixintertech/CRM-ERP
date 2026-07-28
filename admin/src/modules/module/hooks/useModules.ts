import { useCallback, useState } from "react";

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

import { notify } from "@/shared/utils/notify";

export const useModules = () => {
  const [loading, setLoading] =
    useState(false);

  const [modules, setModules] =
    useState<Module[]>([]);

  const loadModules =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getModules();

        setModules(data);
      } catch {
        notify.error(
          "Failed to load modules.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const addModule =
    async (
      payload: ModuleFormData,
    ) => {
      setLoading(true);

      try {
        await createModule(
          payload,
        );

        notify.success(
          "Module created successfully.",
        );

        await loadModules();
      } catch {
        notify.error(
          "Failed to create module.",
        );

        throw new Error();
      } finally {
        setLoading(false);
      }
    };

  const editModule =
    async (
      id: string,
      payload: ModuleFormData,
    ) => {
      setLoading(true);

      try {
        await updateModule(
          id,
          payload,
        );

        notify.success(
          "Module updated successfully.",
        );

        await loadModules();
      } catch {
        notify.error(
          "Failed to update module.",
        );

        throw new Error();
      } finally {
        setLoading(false);
      }
    };

  const removeModule =
    async (
      id: string,
    ) => {
      setLoading(true);

      try {
        await deleteModule(id);

        notify.success(
          "Module deleted successfully.",
        );

        await loadModules();
      } catch {
        notify.error(
          "Failed to delete module.",
        );

        throw new Error();
      } finally {
        setLoading(false);
      }
    };

  return {
    loading,

    modules,

    loadModules,

    addModule,

    editModule,

    removeModule,
  };
};