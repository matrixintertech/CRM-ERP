import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notify } from "@/shared/utils/notify";

import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlanById,
  getSubscriptionPlans,
  updateSubscriptionPlan,
} from "../api/subscriptionPlan.api";

import type {
  SubscriptionPlan,
  SubscriptionPlanFormData,
} from "../types/subscription-plan.types";

const SUBSCRIPTION_PLANS_QUERY_KEY = [
  "subscription-plans",
] as const;

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: string[];
      };
    };
  };

  const errors =
    apiError.response?.data?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(", ");
  }

  return (
    apiError.response?.data?.message ??
    fallbackMessage
  );
};

export const useSubscriptionPlans = () => {
  const queryClient =
    useQueryClient();

  const subscriptionPlansQuery =
    useQuery({
      queryKey:
        SUBSCRIPTION_PLANS_QUERY_KEY,

      queryFn:
        getSubscriptionPlans,

      staleTime:
        5 * 60 * 1000,
    });

  const createMutation =
    useMutation({
      mutationFn: (
        payload: SubscriptionPlanFormData,
      ) =>
        createSubscriptionPlan(
          payload,
        ),

      onSuccess: async () => {
        notify.success(
          "Subscription plan created successfully.",
        );

        await queryClient.invalidateQueries({
          queryKey:
            SUBSCRIPTION_PLANS_QUERY_KEY,
        });
      },

      onError: (error) => {
        console.error(
          "Failed to create subscription plan:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to create subscription plan.",
          ),
        );
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: SubscriptionPlanFormData;
      }) =>
        updateSubscriptionPlan(
          id,
          payload,
        ),

      onSuccess: async (
        _response,
        variables,
      ) => {
        notify.success(
          "Subscription plan updated successfully.",
        );

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              SUBSCRIPTION_PLANS_QUERY_KEY,
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "subscription-plan",
              variables.id,
            ],
          }),
        ]);
      },

      onError: (error) => {
        console.error(
          "Failed to update subscription plan:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to update subscription plan.",
          ),
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        id: string,
      ) =>
        deleteSubscriptionPlan(id),

      onSuccess: async (
        _response,
        id,
      ) => {
        notify.success(
          "Subscription plan deleted successfully.",
        );

        queryClient.removeQueries({
          queryKey: [
            "subscription-plan",
            id,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey:
            SUBSCRIPTION_PLANS_QUERY_KEY,
        });
      },

      onError: (error) => {
        console.error(
          "Failed to delete subscription plan:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to delete subscription plan.",
          ),
        );
      },
    });

  const loadSubscriptionPlans =
    async (): Promise<
      SubscriptionPlan[]
    > => {
      try {
        return await queryClient.fetchQuery({
          queryKey:
            SUBSCRIPTION_PLANS_QUERY_KEY,

          queryFn:
            getSubscriptionPlans,

          staleTime:
            5 * 60 * 1000,
        });
      } catch (error) {
        console.error(
          "Failed to load subscription plans:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load subscription plans.",
          ),
        );

        throw error;
      }
    };

  const fetchSubscriptionPlan =
    async (
      id: string,
    ): Promise<SubscriptionPlan> => {
      try {
        return await queryClient.fetchQuery({
          queryKey: [
            "subscription-plan",
            id,
          ],

          queryFn: () =>
            getSubscriptionPlanById(
              id,
            ),

          staleTime:
            5 * 60 * 1000,
        });
      } catch (error) {
        console.error(
          "Failed to load subscription plan:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load subscription plan.",
          ),
        );

        throw error;
      }
    };

  return {
    subscriptionPlans:
      subscriptionPlansQuery.data ??
      [],

    loading:
      subscriptionPlansQuery.isLoading,

    fetching:
      subscriptionPlansQuery.isFetching,

    error:
      subscriptionPlansQuery.error,

    refetch:
      subscriptionPlansQuery.refetch,

    loadSubscriptionPlans,

    addSubscriptionPlan:
      createMutation.mutateAsync,

    editSubscriptionPlan: (
      id: string,
      payload: SubscriptionPlanFormData,
    ) =>
      updateMutation.mutateAsync({
        id,
        payload,
      }),

    removeSubscriptionPlan:
      deleteMutation.mutateAsync,

    fetchSubscriptionPlan,

    saving:
      createMutation.isPending ||
      updateMutation.isPending,

    deleting:
      deleteMutation.isPending,
  };
};