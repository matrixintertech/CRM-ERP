import type {
  Dispatch,
  SetStateAction,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import PlatformUserForm from "./PlatformUserForm";

import type {
  PlatformUserFormData,
} from "../types/platform-user.types";


interface Props {
  title: string;
  open: boolean;
  isEdit: boolean;
  loading: boolean;

  formData:
    PlatformUserFormData;

  setFormData:
    Dispatch<
      SetStateAction<
        PlatformUserFormData
      >
    >;

  onClose: () => void;
  onSubmit: () => void;
}


const PlatformUserModal = ({
  title,
  open,
  isEdit,
  loading,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: Props) => {
  const disabled =
    !formData.displayName.trim() ||
    !formData.email.trim() ||
    !formData.platformRoleUuid.trim();


  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
    >
      <PlatformUserForm
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
          onClick={
            onSubmit
          }
        >
          {isEdit
            ? "Update User"
            : "Create User"}
        </Button>
      </div>
    </Modal>
  );
};


export default PlatformUserModal;