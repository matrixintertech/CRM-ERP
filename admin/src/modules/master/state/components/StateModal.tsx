import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import StateForm from "./StateForm";

import type {
  StateFormData,
} from "../types/state.types";

import styles from "./StateModal.module.css";

interface Props {
  title: string;
  open: boolean;
  isEdit: boolean;
  loading: boolean;

  formData: StateFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<StateFormData>
  >;

  onClose: () => void;

  onSubmit: () => void | Promise<void>;
}

const StateModal = ({
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
      <StateForm
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
            ? "Update State"
            : "Create State"}
        </Button>
      </div>
    </Modal>
  );
};

export default StateModal;