import api from "@/shared/services/axios";


import type {
  Module,
  AssignedModulesResponse,
} from "../types/subscription-module.types";

export const getModules = async (): Promise<Module[]> => {
  const { data } = await api.get("/modules");

  return data.data.modules;
};

export const getSubscriptionModules = async (
  planId: string,
): Promise<string[]> => {
  const { data } = await api.get(
    `/subscription-plans/${planId}/modules`,
  );

  return data.data.moduleIds;
};

export const assignSubscriptionModules = async (
  planId: string,
  moduleIds: number[],
) => {
  const { data } = await api.put(
    `/subscription-plans/${planId}/modules`,
    {
      moduleIds,
    },
  );

  return data;
};