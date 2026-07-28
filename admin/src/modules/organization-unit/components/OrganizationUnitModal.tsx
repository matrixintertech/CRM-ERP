import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import OrganizationUnitForm from "./OrganizationUnitForm";

import type { OrganizationUnitFormData } from "../types/organization-unit.types";

interface Props {
  open: boolean;
  loading: boolean;
  formData: OrganizationUnitFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<OrganizationUnitFormData>
  >;
  onClose: () => void;
  onSubmit: () => void;
}

const OrganizationUnitModal = ({
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
      title="Add Organization Unit"
      onClose={onClose}
      size="lg"
    >
      <OrganizationUnitForm
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
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default OrganizationUnitModal;