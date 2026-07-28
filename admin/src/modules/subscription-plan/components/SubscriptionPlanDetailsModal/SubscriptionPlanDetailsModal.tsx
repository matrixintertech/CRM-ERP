import Modal from "@/shared/components/Modal";

import type { SubscriptionPlan } from "../../types/subscription-plan.types";

import styles from "./SubscriptionPlanDetailsModal.module.css";

interface Props {
  open: boolean;

  plan: SubscriptionPlan | null;

  onClose: () => void;
}

const SubscriptionPlanDetailsModal = ({
  open,
  plan,
  onClose,
}: Props) => {
  if (!plan) return null;

  return (
    <Modal
      open={open}
      title="Subscription Plan Details"
      size="lg"
      onClose={onClose}
    >
      <div className={styles.wrapper}>
        {/* Header */}

        <div className={styles.header}>
          <h2>{plan.name}</h2>

          <p>{plan.description || "-"}</p>
        </div>

        {/* Summary */}

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span>Price</span>

            <strong>
              ₹{plan.price}
            </strong>
          </div>

          <div className={styles.summaryCard}>
            <span>Billing</span>

            <strong>
              {plan.billingCycle}
            </strong>
          </div>

          <div className={styles.summaryCard}>
            <span>Users</span>

            <strong>
              {plan.maxUsers ?? "Unlimited"}
            </strong>
          </div>

          <div className={styles.summaryCard}>
            <span>Modules</span>

            <strong>
              {plan.moduleIds?.length ??
                0}
            </strong>
          </div>
        </div>

        {/* General */}

        <section className={styles.section}>
          <h3>
            General Information
          </h3>

          <div className={styles.infoGrid}>
            <InfoRow
              label="Name"
              value={plan.name}
            />

            <InfoRow
              label="Code"
              value={plan.code}
            />

            <InfoRow
              label="Status"
              value={plan.status}
            />

            <InfoRow
              label="Public"
              value={
                plan.isPublic
                  ? "Yes"
                  : "No"
              }
            />
          </div>
        </section>

        {/* Pricing */}

        <section className={styles.section}>
          <h3>Pricing</h3>

          <div className={styles.infoGrid}>
            <InfoRow
              label="Plan Type"
              value={plan.planType}
            />

            <InfoRow
              label="Billing"
              value={
                plan.billingCycle
              }
            />

            <InfoRow
              label="Price"
              value={`₹${plan.price}`}
            />

            <InfoRow
              label="Trial Days"
              value={
                String(
                  plan.trialDays ??
                    0,
                )
              }
            />

            <InfoRow
              label="Duration"
              value={
                plan.durationInDays
                  ? `${plan.durationInDays} Days`
                  : "-"
              }
            />
          </div>
        </section>

        {/* Limits */}

        <section className={styles.section}>
          <h3>
            Usage Limits
          </h3>

          <div className={styles.infoGrid}>
            <InfoRow
              label="Users"
              value={
                plan.maxUsers ??
                "Unlimited"
              }
            />

            <InfoRow
              label="Branches"
              value={
                plan.maxBranches ??
                "Unlimited"
              }
            />

            <InfoRow
              label="Projects"
              value={
                plan.maxProjects ??
                "Unlimited"
              }
            />
          </div>
        </section>

        {/* Modules */}

        <section className={styles.section}>
          <h3>
            Included Modules
          </h3>

          <div
            className={
              styles.modulesGrid
            }
          >
            {plan.modules?.length ? (
              plan.modules.map(
                (module) => (
                  <span
                    key={module.id}
                    className={
                      styles.moduleChip
                    }
                  >
                    {module.name}
                  </span>
                ),
              )
            ) : (
              <span>
                No Modules Assigned
              </span>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
};

interface InfoRowProps {
  label: string;

  value: React.ReactNode;
}

const InfoRow = ({
  label,
  value,
}: InfoRowProps) => (
  <div className={styles.infoRow}>
    <span
      className={
        styles.infoLabel
      }
    >
      {label}
    </span>

    <span
      className={
        styles.infoValue
      }
    >
      {value}
    </span>
  </div>
);

export default SubscriptionPlanDetailsModal;