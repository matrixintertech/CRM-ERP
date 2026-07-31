import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import OrganizationUnitForm from "./OrganizationUnitForm";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
} from "../types/organization-unit.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  organizationUnits: OrganizationUnit[];

  formData: OrganizationUnitFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<OrganizationUnitFormData>
  >;

  onClose: () => void;

  onSubmit: () => void;
}

const OrganizationUnitModal = ({
  title,
  isEdit,
  open,
  loading,
  organizationUnits,
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
      size="lg"
    >
      <OrganizationUnitForm
        organizationUnits={organizationUnits}
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
            ? "Update Organization Unit"
            : "Create Organization Unit"}
        </Button>
      </div>
    </Modal>
  );
};

export default OrganizationUnitModal;