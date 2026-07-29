import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type { State } from "../types/state.types";

interface Props {
  open: boolean;
  loading: boolean;
  state: State | null;
  onClose: () => void;
}

const StateDetailsModal = ({
  open,
  loading,
  state,
  onClose,
}: Props) => {
  return (
    <Modal
      open={open}
      title="State Details"
      onClose={onClose}
      size="md"
    >
      {loading ? (
        <p>Loading...</p>
      ) : !state ? (
        <p>No state found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <div>
            <strong>
              State Name
            </strong>
            <p>{state.name}</p>
          </div>

          <div>
            <strong>
              State Code
            </strong>
            <p>{state.code}</p>
          </div>

          <div>
            <strong>
              GST Code
            </strong>
            <p>
              {state.gstCode ||
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
                  state.status
                }
              />
            </div>
          </div>

          <div>
            <strong>
              Created At
            </strong>
            <p>
              {new Date(
                state.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <strong>
              Updated At
            </strong>
            <p>
              {new Date(
                state.updatedAt,
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StateDetailsModal;