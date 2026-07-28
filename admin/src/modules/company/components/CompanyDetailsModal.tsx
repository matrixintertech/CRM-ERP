import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";

import Modal from "@/shared/components/Modal";

import styles from "./CompanyDetailsModal.module.css";

interface Company {
  id: string;
  uuid: string;
  name: string;
  code: string;
  email: string;
  mobile: string;
  logo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  company: Company | null;
  onClose: () => void;
}

const CompanyDetailsModal = ({
  open,
  loading,
  company,
  onClose,
}: Props) => {
  if (!open) return null;

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
      <div className={styles.loading}>
        Loading...
      </div>
    ) : (
      company && (
        <div className={styles.body}>
          {/* Company Header */}

          <div className={styles.companyHeader}>
            <div className={styles.avatar}>
              {company.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className={styles.companyInfo}>
              <h3>{company.name}</h3>

              <p>{company.code}</p>
            </div>

            <Badge
              status={company.status}
            />
          </div>

          {/* Details */}

          <div className={styles.grid}>
            <InfoItem
              label="Email"
              value={
                company.email || "-"
              }
            />

            <InfoItem
              label="Mobile"
              value={
                company.mobile || "-"
              }
            />

            <InfoItem
              label="Created"
              value={new Date(
                company.createdAt,
              ).toLocaleString()}
            />

            <InfoItem
              label="Updated"
              value={new Date(
                company.updatedAt,
              ).toLocaleString()}
            />
          </div>
        </div>
      )
    )}
  </Modal>
);
};

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
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

export default CompanyDetailsModal;

