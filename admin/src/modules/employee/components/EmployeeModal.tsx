import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

import EmployeeForm from "./EmployeeForm";

import type { CreateEmployeeDto } from "../types/employee.types";

interface Props {
  title: string;
  isEdit: boolean;

  open: boolean;
  loading: boolean;

  formData: CreateEmployeeDto;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateEmployeeDto>
  >;

  onClose: () => void;

  onSubmit: () => void;
}

const EmployeeModal = ({
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
      size="lg"
    >
      <EmployeeForm
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
            ? "Update Employee"
            : "Create Employee"}
        </Button>
      </div>
    </Modal>
  );
};

export default EmployeeModal;