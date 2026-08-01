import type {
  Dispatch,
  SetStateAction,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import CityForm from "./CityForm";

import type {
  CityFormData,
} from "../types/city.types";

import styles from "./CityModal.module.css";

interface Props {
  title: string;
  open: boolean;
  isEdit: boolean;
  loading: boolean;

  formData: CityFormData;

  setFormData: Dispatch<
    SetStateAction<CityFormData>
  >;

  onClose: () => void;

  onSubmit: () => void | Promise<void>;
}

const CityModal = ({
  title,
  open,
  isEdit,
  loading,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: Props) => {
  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      title={title}
      onClose={handleClose}
      size="md"
    >
      <CityForm
        formData={formData}
        setFormData={setFormData}
      />

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          type="button"
          loading={loading}
          disabled={loading}
          onClick={() => {
            void onSubmit();
          }}
        >
          {isEdit
            ? "Update City"
            : "Create City"}
        </Button>
      </div>
    </Modal>
  );
};

export default CityModal;