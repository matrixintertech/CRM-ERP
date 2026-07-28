import api from "@/shared/services/axios";

import type {
  Module,
  ModuleFormData,
  ModuleListResponse,
  ModuleResponse,
} from "../types/module.types";

export const getModules =
  async (): Promise<Module[]> => {
    const { data } =
      await api.get("/modules");

    return data.data.modules;
  };

export const getModuleById =
  async (
    id: string,
  ): Promise<Module> => {
    const { data } =
      await api.get(
        `/modules/${id}`,
      );

    return data.data.module;
  };

export const createModule =
  async (
    payload: ModuleFormData,
  ) => {
    const { data } =
      await api.post(
        "/modules",
        payload,
      );

    return data;
  };

export const updateModule =
  async (
    id: string,
    payload: ModuleFormData,
  ) => {
    const { data } =
      await api.patch(
        `/modules/${id}`,
        payload,
      );

    return data;
  };

export const deleteModule =
  async (
    id: string,
  ) => {
    const { data } =
      await api.delete(
        `/modules/${id}`,
      );

    return data;
  };