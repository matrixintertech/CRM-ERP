import { useCallback, useState } from "react";

import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
  getSubscriptionPlanById
} from "../api/subscriptionPlan.api";

import type {
  SubscriptionPlan,
  SubscriptionPlanFormData,
} from "../types/subscription-plan.types";

import { notify } from "@/shared/utils/notify";

export const useSubscriptionPlans = () => {
  const [loading, setLoading] =
    useState(false);

  const [subscriptionPlans, setSubscriptionPlans] =
    useState<SubscriptionPlan[]>([]);

  const loadSubscriptionPlans =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await getSubscriptionPlans();

        setSubscriptionPlans(data);
      } catch {
        notify.error(
          "Failed to load subscription plans.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const addSubscriptionPlan =
    async (
      payload: SubscriptionPlanFormData,
    ) => {
      setLoading(true);

      try {
        await createSubscriptionPlan(
          payload,
        );

        notify.success(
          "Subscription plan created successfully.",
        );

        await loadSubscriptionPlans();
      } catch {
        notify.error(
          "Failed to create subscription plan.",
        );

        throw new Error();
      } finally {
        setLoading(false);
      }
    };

  const editSubscriptionPlan =
    async (
      id: string,
      payload: SubscriptionPlanFormData,
    ) => {
      setLoading(true);

      try {
        await updateSubscriptionPlan(
          id,
          payload,
        );

        notify.success(
          "Subscription plan updated successfully.",
        );

        await loadSubscriptionPlans();
      } catch {
        notify.error(
          "Failed to update subscription plan.",
        );

        throw new Error();
      } finally {
        setLoading(false);
      }
    };

  const removeSubscriptionPlan =
    async (id: string) => {
      setLoading(true);

      try {
        await deleteSubscriptionPlan(id);

        notify.success(
          "Subscription plan deleted successfully.",
        );

        await loadSubscriptionPlans();
      } catch {
        notify.error(
          "Failed to delete subscription plan.",
        );

        throw new Error();
      } finally {
        setLoading(false);
      }
    };

    const fetchSubscriptionPlan =
  async (id: string) => {
    setLoading(true);

    try {
      return await getSubscriptionPlanById(id);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    subscriptionPlans,

    loadSubscriptionPlans,

    addSubscriptionPlan,

    editSubscriptionPlan,

    removeSubscriptionPlan,
    
    fetchSubscriptionPlan
  };
};