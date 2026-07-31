import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import DepartmentForm from "./DepartmentForm";

import type { DepartmentFormData } from "../types/department.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  formData: DepartmentFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<DepartmentFormData>
  >;

  onClose: () => void;

  onSubmit: () => void;
}

const DepartmentModal = ({
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
      <DepartmentForm
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
            ? "Update Department"
            : "Create Department"}
        </Button>
      </div>
    </Modal>
  );
};

export default DepartmentModal;