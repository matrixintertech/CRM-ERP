import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import RoleForm from "./RoleForm";

import type {
  RoleFormData,
} from "../types/role.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  formData: RoleFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<RoleFormData>
  >;

  onClose: () => void;
  onSubmit: () => void;
}

const RoleModal = ({
  title,
  isEdit,
  open,
  loading,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: Props) => {
  const disabled =
    !formData.name.trim() ||
    !formData.code.trim();

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="md"
    >
      <RoleForm
        formData={formData}
        setFormData={setFormData}
        isEdit={isEdit}
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
            disabled
          }
          onClick={onSubmit}
        >
          {isEdit
            ? "Update Role"
            : "Create Role"}
        </Button>
      </div>
    </Modal>
  );
};

export default RoleModal;