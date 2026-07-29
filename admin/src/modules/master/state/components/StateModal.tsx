import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import StateForm from "./StateForm";

import type { StateFormData } from "../types/state.types";

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

  onSubmit: () => void;
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
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="md"
    >
      <StateForm
        formData={formData}
        setFormData={setFormData}
      />

      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
          gap: 12,
          marginTop: 24,
        }}
      >
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          loading={loading}
          onClick={onSubmit}
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