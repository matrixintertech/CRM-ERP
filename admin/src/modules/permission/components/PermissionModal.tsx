import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import PermissionForm from "./PermissionForm";

import type {
  PermissionFormData,
} from "../types/permission.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  formData: PermissionFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<PermissionFormData>
  >;

  onClose: () => void;
  onSubmit: () => void;
}

const PermissionModal = ({
  title,
  isEdit,
  open,
  loading,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: Props) => {
  const isSubmitDisabled =
    !formData.module ||
    !formData.name.trim() ||
    !formData.code.trim();

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
    >
      <PermissionForm
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
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          loading={loading}
          disabled={
            loading ||
            isSubmitDisabled
          }
          onClick={onSubmit}
        >
          {isEdit
            ? "Update Permission"
            : "Create Permission"}
        </Button>
      </div>
    </Modal>
  );
};

export default PermissionModal;