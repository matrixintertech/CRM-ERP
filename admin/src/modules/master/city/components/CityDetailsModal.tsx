import Badge from "@/shared/components/Badge";
import Modal from "@/shared/components/Modal";

import type {
  City,
} from "../types/city.types";

import styles from "./CityDetailsModal.module.css";

interface Props {
  open: boolean;
  loading: boolean;
  city: City | null;
  onClose: () => void;
}

const formatDate = (
  value: string,
) => {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
};

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
        <p className={styles.message}>
          Loading city details...
        </p>
      ) : !city ? (
        <p className={styles.message}>
          No city found.
        </p>
      ) : (
        <div className={styles.details}>
          <div className={styles.item}>
            <strong>State</strong>

            <p>
              {city.state?.name ??
                "-"}
            </p>
          </div>

          <div className={styles.item}>
            <strong>
              City Name
            </strong>

            <p>
              {city.name || "-"}
            </p>
          </div>

          <div className={styles.item}>
            <strong>Status</strong>

            <div
              className={
                styles.badgeWrapper
              }
            >
              <Badge
                status={city.status}
              />
            </div>
          </div>

          <div className={styles.item}>
            <strong>
              Created At
            </strong>

            <p>
              {formatDate(
                city.createdAt,
              )}
            </p>
          </div>

          <div className={styles.item}>
            <strong>
              Updated At
            </strong>

            <p>
              {formatDate(
                city.updatedAt,
              )}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CityDetailsModal;