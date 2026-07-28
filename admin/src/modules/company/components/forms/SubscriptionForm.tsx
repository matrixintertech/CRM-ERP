import type {
  SubscriptionFormData,
} from "../../types/company.types";

import styles from "./SubscriptionForm.module.css";

interface Props {
  formData: SubscriptionFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<SubscriptionFormData>
  >;
}

const plans = [
  {
    id: 10,
    name: "Basic",
    price: "₹999 / Month",
    features: [
      "1 Company",
      "10 Employees",
      "1 Branch",
      "Project Management",
      "Basic Reports",
      "Email Support",
    ],
  },
  {
    id: 2,
    name: "Professional",
    price: "₹2,499 / Month",
    popular: true,
    features: [
      "3 Companies",
      "100 Employees",
      "10 Branches",
      "Inventory",
      "Finance",
      "HR Module",
      "Advanced Reports",
      "Priority Support",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited Companies",
      "Unlimited Employees",
      "Unlimited Branches",
      "All Modules",
      "API Access",
      "Custom Branding",
      "Dedicated Support",
      "Custom Integrations",
    ],
  },
];

const SubscriptionForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div>
      <h2>Select Subscription Plan</h2>

      <div className={styles.grid}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() =>
              setFormData({
                ...formData,
                subscriptionPlanId:
                  plan.id,
              })
            }
            className={`${styles.card} ${
              formData.subscriptionPlanId ===
              plan.id
                ? styles.selected
                : ""
            } ${
              plan.popular
                ? styles.popular
                : ""
            }`}
          >
            {plan.popular && (
              <span className={styles.badge}>
                Most Popular
              </span>
            )}

            <h3>{plan.name}</h3>

            <h2>{plan.price}</h2>

            <ul>
              {plan.features.map(
                (feature) => (
                  <li key={feature}>
                    ✓ {feature}
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionForm;