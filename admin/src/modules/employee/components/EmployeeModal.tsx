import type {
  Dispatch,
  SetStateAction,
} from "react";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import EmployeeForm from "./EmployeeForm";

import type {
  CreateEmployeeDto,
  Employee,
} from "../types/employee.types";

import type {
  OrganizationUnit,
} from "../../organization-unit/types/organization-unit.types";

import type {
  Department,
} from "../../department/types/department.types";

import type {
  Designation,
} from "../../designation/types/designation.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  editingUuid?: string | null;

  employees: Employee[];
  organizationUnits:
    OrganizationUnit[];
  departments: Department[];
  designations: Designation[];

  formData: CreateEmployeeDto;

  setFormData: Dispatch<
    SetStateAction<CreateEmployeeDto>
  >;

  onClose: () => void;
  onSubmit: () => void;
}

const EmployeeModal = ({
  title,
  isEdit,
  open,
  loading,
  editingUuid,
  employees,
  organizationUnits,
  departments,
  designations,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: Props) => {
  const isSubmitDisabled =
    !formData.firstName.trim() ||
    !formData.email.trim() ||
    !formData.organizationUnitUuid ||
    !formData.departmentUuid ||
    !formData.designationUuid;

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
    >
      <EmployeeForm
        employees={employees}
        organizationUnits={
          organizationUnits
        }
        departments={departments}
        designations={designations}
        editingUuid={editingUuid}
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
            ? "Update Employee"
            : "Create Employee"}
        </Button>
      </div>
    </Modal>
  );
};

export default EmployeeModal;