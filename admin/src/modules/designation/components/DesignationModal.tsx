import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import DesignationForm from "./DesignationForm";

import type { DesignationFormData } from "../types/designation.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  formData: DesignationFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<DesignationFormData>
  >;

  onClose: () => void;

  onSubmit: () => void;
}

const DesignationModal = ({
  title,
  isEdit,
  open,
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
      <DesignationForm
        formData={formData}
        setFormData={setFormData}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
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
            ? "Update Designation"
            : "Create Designation"}
        </Button>
      </div>
    </Modal>
  );
};

export default DesignationModal;