import api from "@/shared/services/axios";

import type {
  SubscriptionPlan,
  SubscriptionPlanFormData,
} from "../types/subscription-plan.types";


const BASE_URL =
  "/platform/subscription-plans";


export const getSubscriptionPlans =
  async (): Promise<
    SubscriptionPlan[]
  > => {
    const { data } =
      await api.get(
        BASE_URL,
      );

    return (
      data.data?.subscriptionPlans ??
      data.subscriptionPlans ??
      []
    );
  };


export const getSubscriptionPlanById =
  async (
    id: string,
  ): Promise<SubscriptionPlan> => {
    const { data } =
      await api.get(
        `${BASE_URL}/${id}`,
      );

    return (
      data.data?.subscriptionPlan ??
      data.subscriptionPlan ??
      data.data
    );
  };


export const createSubscriptionPlan =
  async (
    payload:
      SubscriptionPlanFormData,
  ): Promise<SubscriptionPlan> => {
    const { data } =
      await api.post(
        BASE_URL,
        payload,
      );

    return (
      data.data?.subscriptionPlan ??
      data.subscriptionPlan ??
      data.data
    );
  };


export const updateSubscriptionPlan =
  async (
    id: string,
    payload:
      SubscriptionPlanFormData,
  ): Promise<SubscriptionPlan> => {
    const { data } =
      await api.patch(
        `${BASE_URL}/${id}`,
        payload,
      );

    return (
      data.data?.subscriptionPlan ??
      data.subscriptionPlan ??
      data.data
    );
  };


export const deleteSubscriptionPlan =
  async (
    id: string,
  ) => {
    const { data } =
      await api.delete(
        `${BASE_URL}/${id}`,
      );

    return data;
  };