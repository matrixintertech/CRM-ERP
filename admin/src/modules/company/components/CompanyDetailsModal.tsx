import type {
  ReactNode,
} from "react";

import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type {
  Company,
} from "../types/company.types";

import styles from "./CompanyDetailsModal.module.css";

interface Props {
  open: boolean;
  loading: boolean;
  company: Company | null;
  onClose: () => void;
}

interface InfoItemProps {
  label: string;
  value: ReactNode;
}

const InfoItem = ({
  label,
  value,
}: InfoItemProps) => (
  <div className={styles.infoItem}>
    <span className={styles.label}>
      {label}
    </span>

    <span className={styles.value}>
      {value}
    </span>
  </div>
);

const CompanyDetailsModal = ({
  open,
  loading,
  company,
  onClose,
}: Props) => {
  if (!open) {
    return null;
  }

  return (
    <Modal
      open={open}
      title="Company Details"
      size="md"
      onClose={onClose}
      footer={
        <Button
          onClick={onClose}
        >
          Close
        </Button>
      }
    >
      {loading ? (
        <div
          className={
            styles.loading
          }
        >
          Loading...
        </div>
      ) : !company ? (
        <div
          className={
            styles.loading
          }
        >
          Company not found.
        </div>
      ) : (
        <div
          className={
            styles.body
          }
        >
          <div
            className={
              styles.companyHeader
            }
          >
            <div
              className={
                styles.avatar
              }
            >
              {company.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div
              className={
                styles.companyInfo
              }
            >
              <h3>
                {company.name}
              </h3>

              <p>
                {company.code}
              </p>
            </div>

            <Badge
              status={
                company.status
              }
            />
          </div>

          <div
            className={
              styles.grid
            }
          >
            <InfoItem
              label="Email"
              value={
                company.email ??
                "-"
              }
            />

            <InfoItem
              label="Mobile"
              value={
                company.mobile ??
                "-"
              }
            />

            <InfoItem
              label="Type"
              value={
                company.type ??
                "-"
              }
            />

            <InfoItem
              label="Created"
              value={
                new Date(
                  company.createdAt,
                ).toLocaleString(
                  "en-IN",
                )
              }
            />

            <InfoItem
              label="Updated"
              value={
                new Date(
                  company.updatedAt,
                ).toLocaleString(
                  "en-IN",
                )
              }
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CompanyDetailsModal;