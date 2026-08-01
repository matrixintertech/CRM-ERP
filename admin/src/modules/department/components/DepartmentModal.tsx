import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import DepartmentForm from "./DepartmentForm";

import type {
  DepartmentFormData,
} from "../types/department.types";

import type {
  OrganizationUnit,
} from "../../organization-unit/types/organization-unit.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  organizationUnits: OrganizationUnit[];

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
  organizationUnits,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: Props) => {
  const isSubmitDisabled =
    !formData.organizationUnitUuid ||
    !formData.name.trim() ||
    !formData.code.trim();

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="md"
    >
      <DepartmentForm
        organizationUnits={
          organizationUnits
        }
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
          disabled={loading}
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
            ? "Update Department"
            : "Create Department"}
        </Button>
      </div>
    </Modal>
  );
};

export default DepartmentModal;