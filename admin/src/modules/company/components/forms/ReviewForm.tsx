import type {
  CompanyAdminFormData,
  CompanyFormData,
  SubscriptionFormData,
} from "../../types/company.types";

import styles from "./ReviewForm.module.css";

interface Props {
  company: CompanyFormData;
  subscription: SubscriptionFormData;
  admin: CompanyAdminFormData;
}

const ReviewForm = ({
  company,
  subscription,
  admin,
}: Props) => {
  return (
    <div className={styles.review}>
      <h2>Review Company Setup</h2>

      <div className={styles.card}>
        <h3>Company Information</h3>

        <p>
          <strong>Name:</strong>{" "}
          {company.name}
        </p>

        <p>
          <strong>Code:</strong>{" "}
          {company.code}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {company.email}
        </p>

        <p>
          <strong>Mobile:</strong>{" "}
          {company.mobile}
        </p>
      </div>

      <div className={styles.card}>
        <h3>Subscription</h3>

        <p>
          <strong>Plan ID:</strong>{" "}
          {
            subscription.subscriptionPlanId
          }
        </p>

        <p>
          <strong>Start:</strong>{" "}
          {subscription.startDate}
        </p>

        <p>
          <strong>End:</strong>{" "}
          {subscription.endDate}
        </p>
      </div>

      <div className={styles.card}>
        <h3>Company Admin</h3>

        <p>
          <strong>Name:</strong>{" "}
          {admin.displayName}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {admin.email}
        </p>

        <p>
          <strong>Mobile:</strong>{" "}
          {admin.mobile}
        </p>
      </div>
    </div>
  );
};

export default ReviewForm;