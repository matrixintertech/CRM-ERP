import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  CreateEmployeeDto,
  Employee,
  EmploymentType,
  Gender,
  Status,
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

import styles from "./EmployeeForm.module.css";

interface Props {
  employees: Employee[];

  organizationUnits: OrganizationUnit[];

  departments: Department[];

  designations: Designation[];

  editingUuid?: string | null;

  formData: CreateEmployeeDto;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateEmployeeDto>
  >;
}

const NO_MANAGER_VALUE =
  "__NO_MANAGER__";

const EmployeeForm = ({
  employees,
  organizationUnits,
  departments,
  designations,
  editingUuid,
  formData,
  setFormData,
}: Props) => {
  const locationOptions =
    organizationUnits
      .filter(
        (unit) =>
          unit.status === "ACTIVE",
      )
      .map((unit) => ({
        label: `${unit.name} (${unit.code})`,
        value: unit.uuid,
      }));

  const filteredDepartments =
    departments.filter(
      (department) =>
        department.status === "ACTIVE" &&
        department.organizationUnit
          ?.uuid ===
          formData.organizationUnitUuid,
    );

  const departmentOptions =
    filteredDepartments.map(
      (department) => ({
        label: department.name,
        value: department.uuid,
      }),
    );

  const filteredDesignations =
    designations.filter(
      (designation) =>
        designation.status === "ACTIVE" &&
        designation.department
          ?.uuid ===
          formData.departmentUuid,
    );

  const designationOptions =
    filteredDesignations.map(
      (designation) => ({
        label: designation.name,
        value: designation.uuid,
      }),
    );

  const managerOptions = [
    {
      label:
        "None / No Reporting Manager",
      value: NO_MANAGER_VALUE,
    },

    ...employees
      .filter(
        (employee) =>
          employee.status === "ACTIVE" &&
          employee.uuid !== editingUuid,
      )
      .map((employee) => ({
        label:
          employee.displayName ||
          `${employee.firstName} ${
            employee.lastName ?? ""
          }`.trim(),

        value: employee.uuid,
      })),
  ];

  const handleLocationChange = (
    organizationUnitUuid: string,
  ) => {
    setFormData((previous) => ({
      ...previous,

      organizationUnitUuid,

      departmentUuid: "",

      designationUuid: "",
    }));
  };

  const handleDepartmentChange = (
    departmentUuid: string,
  ) => {
    setFormData((previous) => ({
      ...previous,

      departmentUuid,

      designationUuid: "",
    }));
  };

  return (
    <div className={styles.form}>
      <Input
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              firstName:
                event.target.value,
            }),
          )
        }
      />

      <Input
        label="Last Name"
        name="lastName"
        value={
          formData.lastName ?? ""
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              lastName:
                event.target.value,
            }),
          )
        }
      />

      <Input
        label="Display Name"
        name="displayName"
        value={
          formData.displayName ?? ""
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              displayName:
                event.target.value,
            }),
          )
        }
      />

      <Input
        type="email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              email:
                event.target.value,
            }),
          )
        }
      />

      <Input
        label="Mobile"
        name="mobile"
        value={
          formData.mobile ?? ""
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              mobile:
                event.target.value.replace(
                  /\D/g,
                  "",
                ),
            }),
          )
        }
      />

      <Select
        label="Location"
        name="organizationUnitUuid"
        placeholder="Select location"
        value={
          formData.organizationUnitUuid ??
          ""
        }
        options={locationOptions}
        onChange={(event) =>
          handleLocationChange(
            event.target.value,
          )
        }
      />

      <Select
        label="Department"
        name="departmentUuid"
        placeholder={
          formData.organizationUnitUuid
            ? "Select department"
            : "Select location first"
        }
        value={
          formData.departmentUuid ??
          ""
        }
        options={departmentOptions}
        onChange={(event) =>
          handleDepartmentChange(
            event.target.value,
          )
        }
      />

      <Select
        label="Designation"
        name="designationUuid"
        placeholder={
          formData.departmentUuid
            ? "Select designation"
            : "Select department first"
        }
        value={
          formData.designationUuid ??
          ""
        }
        options={designationOptions}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              designationUuid:
                event.target.value,
            }),
          )
        }
      />

      <Select
        label="Reporting Manager"
        name="managerUuid"
        value={
          formData.managerUuid ||
          NO_MANAGER_VALUE
        }
        options={managerOptions}
        showPlaceholder={false}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              managerUuid:
                event.target.value ===
                NO_MANAGER_VALUE
                  ? ""
                  : event.target.value,
            }),
          )
        }
      />

      <Select
        label="Gender"
        name="gender"
        placeholder="Select gender"
        value={
          formData.gender ?? ""
        }
        options={[
          {
            label: "Male",
            value: "MALE",
          },
          {
            label: "Female",
            value: "FEMALE",
          },
        ]}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              gender:
                event.target
                  .value as Gender,
            }),
          )
        }
      />

      <Input
        type="date"
        label="Joining Date"
        name="joiningDate"
        value={
          formData.joiningDate ?? ""
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              joiningDate:
                event.target.value,
            }),
          )
        }
      />

      <Select
        label="Employment Type"
        name="employmentType"
        placeholder="Select employment type"
        value={
          formData.employmentType ??
          ""
        }
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
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              employmentType:
                event.target
                  .value as EmploymentType,
            }),
          )
        }
      />

      <Select
        label="Status"
        name="status"
        value={
          formData.status ??
          "ACTIVE"
        }
        showPlaceholder={false}
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
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              status:
                event.target
                  .value as Status,
            }),
          )
        }
      />

      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: 8,
          padding: "14px 16px",
          border:
            "1px solid var(--border-color, #e5e7eb)",
          borderRadius: 8,
          background:
            "var(--surface-muted, #f8fafc)",
        }}
      >
        <div
          style={{
            fontWeight: 600,
          }}
        >
          Login Account
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            opacity: 0.75,
          }}
        >
          Employee record will be
          created first. Login access
          and role can be configured
          later from the employee list
          using{" "}
          <strong>
            Create Login
          </strong>{" "}
          or{" "}
          <strong>
            Manage Access
          </strong>
          .
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;