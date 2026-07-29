import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type { Client } from "../types/client.types";

interface Props {
  open: boolean;
  loading: boolean;
  client: Client | null;
  onClose: () => void;
}

const ClientDetailsModal = ({
  open,
  loading,
  client,
  onClose,
}: Props) => {
  return (
    <Modal
      open={open}
      title="Client Details"
      onClose={onClose}
      size="lg"
    >
      {loading ? (
        <p>Loading...</p>
      ) : !client ? (
        <p>No client found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <div>
            <strong>Client Name</strong>
            <p>{client.name}</p>
          </div>

          <div>
            <strong>Client Code</strong>
            <p>{client.code}</p>
          </div>

          <div>
            <strong>Contact Person</strong>
            <p>{client.contactName}</p>
          </div>

          <div>
            <strong>Mobile</strong>
            <p>{client.mobile}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{client.email || "-"}</p>
          </div>

          <div>
            <strong>GST Number</strong>
            <p>{client.gstNumber || "-"}</p>
          </div>

          <div>
            <strong>PAN Number</strong>
            <p>{client.panNumber || "-"}</p>
          </div>

          <div>
            <strong>State</strong>
            <p>{client.state?.name || "-"}</p>
          </div>

          <div>
            <strong>City</strong>
            <p>{client.city?.name || "-"}</p>
          </div>

          <div>
            <strong>Pincode</strong>
            <p>{client.pincode || "-"}</p>
          </div>

          <div>
            <strong>Address</strong>
            <p>{client.address || "-"}</p>
          </div>

          <div>
            <strong>Remarks</strong>
            <p>{client.remarks || "-"}</p>
          </div>

          <div>
            <strong>Status</strong>

            <div
              style={{
                marginTop: 6,
              }}
            >
              <Badge status={client.status} />
            </div>
          </div>

          <div>
            <strong>Created At</strong>
            <p>
              {new Date(
                client.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <strong>Updated At</strong>
            <p>
              {new Date(
                client.updatedAt,
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ClientDetailsModal;