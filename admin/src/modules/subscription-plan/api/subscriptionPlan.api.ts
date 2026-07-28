import api from "@/shared/services/axios";

import type {
  SubscriptionPlan,
  SubscriptionPlanFormData,
} from "../types/subscription-plan.types";

export const getSubscriptionPlans =
  async (): Promise<
    SubscriptionPlan[]
  > => {
    const { data } =
      await api.get(
        "/subscription-plans",
      );

    return data.data
      .subscriptionPlans;
  };

export const getSubscriptionPlanById =
  async (
    id: string,
  ): Promise<SubscriptionPlan> => {
    const { data } =
      await api.get(
        `/subscription-plans/${id}`,
      );

    return data.data
      .subscriptionPlan;
  };

export const createSubscriptionPlan =
  async (
    payload: SubscriptionPlanFormData,
  ) => {
    const { data } =
      await api.post(
        "/subscription-plans",
        payload,
      );

    return data;
  };

export const updateSubscriptionPlan =
  async (
    id: string,
    payload: SubscriptionPlanFormData,
  ) => {
    const { data } =
      await api.patch(
        `/subscription-plans/${id}`,
        payload,
      );

    return data;
  };

export const deleteSubscriptionPlan =
  async (
    id: string,
  ) => {
    const { data } =
      await api.delete(
        `/subscription-plans/${id}`,
      );

    return data;
  };