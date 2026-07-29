import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type { City } from "../types/city.types";

interface Props {
  open: boolean;
  loading: boolean;
  city: City | null;
  onClose: () => void;
}

const CityDetailsModal = ({
  open,
  loading,
  city,
  onClose,
}: Props) => {
  return (
    <Modal
      open={open}
      title="City Details"
      onClose={onClose}
      size="md"
    >
      {loading ? (
        <p>Loading...</p>
      ) : !city ? (
        <p>No city found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <div>
            <strong>
              State
            </strong>
            <p>{city.state.name}</p>
          </div>

          <div>
            <strong>
              City Name
            </strong>
            <p>{city.name}</p>
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
                status={city.status}
              />
            </div>
          </div>

          <div>
            <strong>
              Created At
            </strong>
            <p>
              {new Date(
                city.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <strong>
              Updated At
            </strong>
            <p>
              {new Date(
                city.updatedAt,
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CityDetailsModal;