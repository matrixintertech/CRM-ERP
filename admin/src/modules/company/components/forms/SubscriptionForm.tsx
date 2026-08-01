import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  SubscriptionPlan,
} from "@/modules/subscription-plan/types/subscription-plan.types";

import type {
  SubscriptionFormData,
} from "../../types/company.types";

import styles from "./SubscriptionForm.module.css";

interface Props {
  formData: SubscriptionFormData;

  setFormData: Dispatch<
    SetStateAction<SubscriptionFormData>
  >;

  plans: SubscriptionPlan[];

  loading?: boolean;
}

const billingCycleLabels: Record<
  string,
  string
> = {
  MONTHLY: "Month",
  QUARTERLY: "Quarter",
  HALF_YEARLY: "6 Months",
  YEARLY: "Year",
  LIFETIME: "Lifetime",
};

const formatPrice = (
  price: string | number,
  billingCycle: string,
) => {
  const amount = Number(price);

  if (amount === 0) {
    return "Free";
  }

  const formattedPrice =
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  if (billingCycle === "LIFETIME") {
    return `${formattedPrice} one time`;
  }

  const cycle =
    billingCycleLabels[billingCycle] ??
    billingCycle;

  return `${formattedPrice} / ${cycle}`;
};

const SubscriptionForm = ({
  formData,
  setFormData,
  plans,
  loading = false,
}: Props) => {
  const availablePlans = plans.filter(
    (plan) =>
      plan.status === "ACTIVE" &&
      plan.isPublic,
  );

  if (loading) {
    return (
      <div>
        <h2>Select Subscription Plan</h2>

        <p>Loading subscription plans...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Select Subscription Plan</h2>

      {availablePlans.length === 0 ? (
        <p>
          No active subscription plans
          available.
        </p>
      ) : (
        <div className={styles.grid}>
          {availablePlans.map(
            (plan, index) => {
              const planId = Number(
                plan.id,
              );

              const isSelected =
                formData.subscriptionPlanId ===
                planId;

              const isPopular =
                plan.planType === "PAID" &&
                index === 0;

              return (
                <button
                  key={String(plan.id)}
                  type="button"
                  onClick={() =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        subscriptionPlanId:
                          planId,
                      }),
                    )
                  }
                  className={[
                    styles.card,
                    isSelected
                      ? styles.selected
                      : "",
                    isPopular
                      ? styles.popular
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={isSelected}
                >
                  {isPopular && (
                    <span
                      className={
                        styles.badge
                      }
                    >
                      Most Popular
                    </span>
                  )}

                  <h3>{plan.name}</h3>

                  <h2>
                    {formatPrice(
                      plan.price,
                      plan.billingCycle,
                    )}
                  </h2>

                  {plan.description && (
                    <p>
                      {plan.description}
                    </p>
                  )}

                  <ul>
                    <li>
                      ✓ Plan type:{" "}
                      {plan.planType}
                    </li>

                    {plan.maxUsers != null && (
                      <li>
                        ✓ Up to{" "}
                        {plan.maxUsers} users
                      </li>
                    )}

                    {plan.maxBranches !=
                      null && (
                      <li>
                        ✓ Up to{" "}
                        {
                          plan.maxBranches
                        }{" "}
                        branches
                      </li>
                    )}

                    {plan.maxProjects !=
                      null && (
                      <li>
                        ✓ Up to{" "}
                        {
                          plan.maxProjects
                        }{" "}
                        projects
                      </li>
                    )}

                    {plan.trialDays > 0 && (
                      <li>
                        ✓ {plan.trialDays} days
                        trial
                      </li>
                    )}

                    {plan.durationInDays !=
                      null && (
                      <li>
                        ✓ Valid for{" "}
                        {
                          plan.durationInDays
                        }{" "}
                        days
                      </li>
                    )}

                    {plan.planType ===
                      "LIFETIME" && (
                      <li>
                        ✓ Lifetime access
                      </li>
                    )}
                  </ul>

                  <strong>
                    {isSelected
                      ? "Selected"
                      : "Select Plan"}
                  </strong>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionForm;