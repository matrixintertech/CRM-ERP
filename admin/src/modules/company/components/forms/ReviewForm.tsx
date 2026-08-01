import type {
  CompanyAdminFormData,
  CompanyFormData,
  SubscriptionFormData,
} from "../../types/company.types";

import type {
  SubscriptionPlan,
} from "@/modules/subscription-plan/types/subscription-plan.types";

import styles from "./ReviewForm.module.css";

interface Props {
  company: CompanyFormData;
  subscription: SubscriptionFormData;
  admin: CompanyAdminFormData;
  plans: SubscriptionPlan[];
}

const billingCycleLabels: Record<
  string,
  string
> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  HALF_YEARLY: "Half Yearly",
  YEARLY: "Yearly",
  LIFETIME: "Lifetime",
};

const planTypeLabels: Record<
  string,
  string
> = {
  INTERNAL: "Internal",
  TRIAL: "Trial",
  PAID: "Paid",
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
    return `${formattedPrice} One Time`;
  }

  return `${formattedPrice} / ${
    billingCycleLabels[billingCycle] ??
    billingCycle
  }`;
};

const ReviewForm = ({
  company,
  subscription,
  admin,
  plans,
}: Props) => {
  const selectedPlan = plans.find(
    (plan) =>
      Number(plan.id) ===
      subscription.subscriptionPlanId,
  );

  return (
    <div className={styles.review}>
      <h2>Review Company Setup</h2>

      <div className={styles.card}>
        <h3>Company Information</h3>

        <p>
          <strong>Name:</strong>{" "}
          {company.name || "-"}
        </p>

        <p>
          <strong>Code:</strong>{" "}
          {company.code || "-"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {company.email || "-"}
        </p>

        <p>
          <strong>Mobile:</strong>{" "}
          {company.mobile || "-"}
        </p>

        <p>
          <strong>Logo:</strong>{" "}
          {company.logo || "-"}
        </p>
      </div>

      <div className={styles.card}>
        <h3>Subscription Plan</h3>

        {selectedPlan ? (
          <>
            <p>
              <strong>Plan:</strong>{" "}
              {selectedPlan.name}
            </p>

            <p>
              <strong>Code:</strong>{" "}
              {selectedPlan.code}
            </p>

            <p>
              <strong>Plan Type:</strong>{" "}
              {planTypeLabels[
                selectedPlan.planType
              ] ??
                selectedPlan.planType}
            </p>

            <p>
              <strong>
                Billing Cycle:
              </strong>{" "}
              {billingCycleLabels[
                selectedPlan.billingCycle
              ] ??
                selectedPlan.billingCycle}
            </p>

            <p>
              <strong>Price:</strong>{" "}
              {formatPrice(
                selectedPlan.price,
                selectedPlan.billingCycle,
              )}
            </p>

            {selectedPlan.trialDays >
              0 && (
              <p>
                <strong>
                  Trial Days:
                </strong>{" "}
                {
                  selectedPlan.trialDays
                }
              </p>
            )}

            {selectedPlan.durationInDays !=
              null && (
              <p>
                <strong>
                  Duration:
                </strong>{" "}
                {
                  selectedPlan.durationInDays
                }{" "}
                Days
              </p>
            )}

            <p>
              <strong>
                Max Users:
              </strong>{" "}
              {selectedPlan.maxUsers ??
                "Unlimited"}
            </p>

            <p>
              <strong>
                Max Branches:
              </strong>{" "}
              {selectedPlan.maxBranches ??
                "Unlimited"}
            </p>

            <p>
              <strong>
                Max Projects:
              </strong>{" "}
              {selectedPlan.maxProjects ??
                "Unlimited"}
            </p>
          </>
        ) : (
          <p>
            No subscription plan
            selected.
          </p>
        )}
      </div>

      <div className={styles.card}>
        <h3>Company Admin</h3>

        <p>
          <strong>Name:</strong>{" "}
          {admin.displayName || "-"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {admin.email || "-"}
        </p>

        <p>
          <strong>Mobile:</strong>{" "}
          {admin.mobile || "-"}
        </p>
      </div>
    </div>
  );
};

export default ReviewForm;