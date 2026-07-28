import Modal from "@/shared/components/Modal";
import Badge from "@/shared/components/Badge";

import type { Role } from "../types/role.types";

interface Props {
  open: boolean;
  loading: boolean;
  role: Role | null;
  onClose: () => void;
}

const RoleDetailsModal = ({
  open,
  loading,
  role,
  onClose,
}: Props) => {
  return (
    <Modal
      open={open}
      title="Role Details"
      onClose={onClose}
      size="md"
    >
      {loading ? (
        <p>Loading...</p>
      ) : !role ? (
        <p>No role found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <div>
            <strong>
              Role Name
            </strong>
            <p>{role.name}</p>
          </div>

          <div>
            <strong>
              Role Code
            </strong>
            <p>{role.code}</p>
          </div>

          <div>
            <strong>
              Description
            </strong>
            <p>
              {role.description ||
                "-"}
            </p>
          </div>

          <div>
            <strong>
              Status
            </strong>
            <div
              style={{
                marginTop: 6,
              }}
            >
              <Badge
                status={
                  role.status
                }
              />
            </div>
          </div>

          <div>
            <strong>
              System Role
            </strong>
            <p>
              {role.isSystem
                ? "Yes"
                : "No"}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RoleDetailsModal;