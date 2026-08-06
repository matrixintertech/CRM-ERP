import type { ReactNode } from "react";

import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type { PlatformUser } from "../types/platform-user.types";

interface Props {
  open: boolean;
  loading: boolean;
  user: PlatformUser | null;
  onClose: () => void;
}

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("en-IN");
};

const PlatformUserDetailsModal = ({ open, loading, user, onClose }: Props) => {
  return (
    <Modal
      open={open}
      title="Platform User Details"
      onClose={onClose}
      size="md"
    >
      {loading ? (
        <p>Loading...</p>
      ) : !user ? (
        <p>No platform user found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <DetailItem label="Name" value={user.displayName} />

          <DetailItem label="Email" value={user.email} />

          <DetailItem label="Mobile" value={user.mobile} />

          <DetailItem label="Status" value={<Badge status={user.status} />} />

          <DetailItem
            label="Email Verified"
            value={user.emailVerified ? "Yes" : "No"}
          />

          <DetailItem
            label="Mobile Verified"
            value={user.mobileVerified ? "Yes" : "No"}
          />

          <DetailItem label="Last Login" value={formatDate(user.lastLoginAt)} />

          <DetailItem label="Created At" value={formatDate(user.createdAt)} />
        </div>
      )}
    </Modal>
  );
};

interface DetailItemProps {
  label: string;
  value?: ReactNode;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div>
    <strong>{label}</strong>

    <p>{value !== null && value !== undefined && value !== "" ? value : "-"}</p>
  </div>
);

export default PlatformUserDetailsModal;
