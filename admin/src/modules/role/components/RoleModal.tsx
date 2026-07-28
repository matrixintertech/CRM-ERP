import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import RoleForm from "./RoleForm";

import type { RoleFormData } from "../types/role.types";

interface Props {
  title: string;
  open: boolean;
   isEdit: boolean;
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
      <RoleForm
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
            ? "Update Role"
            : "Create Role"}
        </Button>
      </div>
    </Modal>
  );
};

export default RoleModal;