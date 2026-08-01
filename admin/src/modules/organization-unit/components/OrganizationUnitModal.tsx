import type {
  Dispatch,
  SetStateAction,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import OrganizationUnitForm from "./OrganizationUnitForm";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
} from "../types/organization-unit.types";

import styles from "./OrganizationUnitModal.module.css";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  organizationUnits: OrganizationUnit[];

  editingUuid?: string | null;

  formData: OrganizationUnitFormData;

  setFormData: Dispatch<
    SetStateAction<OrganizationUnitFormData>
  >;

  onClose: () => void;

  onSubmit: () => void | Promise<void>;
}

const OrganizationUnitModal = ({
  title,
  isEdit,
  open,
  loading,
  organizationUnits,
  editingUuid,
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
      size="lg"
    >
      <OrganizationUnitForm
        organizationUnits={
          organizationUnits
        }
        editingUuid={editingUuid}
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
            ? "Update Organization Unit"
            : "Create Organization Unit"}
        </Button>
      </div>
    </Modal>
  );
};

export default OrganizationUnitModal;