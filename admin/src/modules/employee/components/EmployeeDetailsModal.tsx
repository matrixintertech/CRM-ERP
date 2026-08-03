import Modal from "@/shared/components/Modal";

import EmployeeDetails from "./EmployeeDetails";

import type {
  Employee,
} from "../types/employee.types";

interface Props {
  open: boolean;

  employee: Employee | null;

  onClose: () => void;
}

const EmployeeDetailsModal = ({
  open,
  employee,
  onClose,
}: Props) => {
  return (
    <Modal
      open={open}
      title={
        employee
          ? `${employee.displayName || employee.firstName} Details`
          : "Employee Details"
      }
      onClose={onClose}
      size="lg"
    >
      <EmployeeDetails
        employee={employee}
      />
    </Modal>
  );
};

export default EmployeeDetailsModal;