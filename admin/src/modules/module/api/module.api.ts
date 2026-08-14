import api from "@/shared/services/axios";

import type {
  Module,
  ModuleFormData,
} from "../types/module.types";


const BASE_URL =
  "/platform/modules";


export const getModules =
  async (): Promise<Module[]> => {
    const { data } =
      await api.get(
        BASE_URL,
      );

    return (
      data.data?.modules ??
      data.modules ??
      []
    );
  };


export const getModuleById =
  async (
    id: string,
  ): Promise<Module> => {
    const { data } =
      await api.get(
        `${BASE_URL}/${id}`,
      );

    return (
      data.data?.module ??
      data.module ??
      data.data
    );
  };


export const createModule =
  async (
    payload: ModuleFormData,
  ): Promise<Module> => {
    const { data } =
      await api.post(
        BASE_URL,
        payload,
      );

    return (
      data.data?.module ??
      data.module ??
      data.data
    );
  };


export const updateModule =
  async (
    id: string,
    payload:
      Partial<ModuleFormData>,
  ): Promise<Module> => {
    const { data } =
      await api.patch(
        `${BASE_URL}/${id}`,
        payload,
      );

    return (
      data.data?.module ??
      data.module ??
      data.data
    );
  };


export const deleteModule =
  async (
    id: string,
  ) => {
    const { data } =
      await api.delete(
        `${BASE_URL}/${id}`,
      );

    return data;
  };