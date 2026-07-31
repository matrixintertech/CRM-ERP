import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  CreateEmployeeDto,
  Gender,
  EmploymentType,
  Status,
} from "../types/employee.types";

import styles from "./EmployeeForm.module.css";

interface Props {
  formData: CreateEmployeeDto;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateEmployeeDto>
  >;
}

const EmployeeForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="First Name"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({
            ...formData,
            firstName: e.target.value,
          })
        }
      />

      <Input
        label="Last Name"
        value={formData.lastName ?? ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            lastName: e.target.value,
          })
        }
      />

      <Input
        label="Display Name"
        value={formData.displayName ?? ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            displayName: e.target.value,
          })
        }
      />

      <Input
        type="email"
        label="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value,
          })
        }
      />

      <Input
        label="Mobile"
        value={formData.mobile ?? ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            mobile: e.target.value,
          })
        }
      />

      <Select
        label="Gender"
        value={formData.gender ?? ""}
        options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
        ]}
        onChange={(e) =>
            setFormData((prev) => ({
            ...prev,
            gender: e.target.value as Gender,
            }))
        }
/>

      <Input
        type="date"
        label="Joining Date"
        value={
          formData.joiningDate ?? ""
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            joiningDate:
              e.target.value,
          })
        }
      />

     <Select
        label="Employment Type"
        value={formData.employmentType ?? ""}
        options={[
            {
            label: "Full Time",
            value: "FULL_TIME",
            },
            {
            label: "Part Time",
            value: "PART_TIME",
            },
            {
            label: "Contract",
            value: "CONTRACT",
            },
            {
            label: "Intern",
            value: "INTERN",
            },
        ]}
        onChange={(e) =>
            setFormData((prev) => ({
            ...prev,
            employmentType: e.target.value as EmploymentType,
            }))
        }
        />


            <Select
        label="Status"
        value={formData.status ?? ""}
        options={[
            {
            label: "Active",
            value: "ACTIVE",
            },
            {
            label: "Inactive",
            value: "INACTIVE",
            },
        ]}
        onChange={(e) =>
            setFormData((prev) => ({
            ...prev,
            status: e.target.value as Status,
            }))
        }
        />
    </div>
  );
};

export default EmployeeForm;