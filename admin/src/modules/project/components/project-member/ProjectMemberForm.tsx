import type {
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  ProjectMemberFormData,
} from "../../types/project-member.types";

interface EmployeeOption {
  uuid: string;
  label: string;
}

interface ProjectRoleOption {
  uuid: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

interface Props {
  formData: ProjectMemberFormData;

  setFormData: Dispatch<
    SetStateAction<ProjectMemberFormData>
  >;

  employees: EmployeeOption[];

  projectRoles: ProjectRoleOption[];

  loadingEmployees?: boolean;

  loadingRoles?: boolean;
}

const ProjectMemberForm = ({
  formData,
  setFormData,

  employees,
  projectRoles,

  loadingEmployees = false,
  loadingRoles = false,
}: Props) => {
  const employeeOptions = [
    {
      label: loadingEmployees
        ? "Loading employees..."
        : "Select Employee",
      value: "",
    },

    ...employees.map(
      (employee) => ({
        label:
          employee.label,
        value:
          employee.uuid,
      }),
    ),
  ];

  const projectRoleOptions = [
    {
      label: loadingRoles
        ? "Loading project roles..."
        : "Select Project Role",
      value: "",
    },

    ...projectRoles
      .filter(
        (role) =>
          role.status ===
          "ACTIVE",
      )
      .map((role) => ({
        label:
          role.name,
        value:
          role.uuid,
      })),
  ];

  return (
    <div
      style={{
        display: "grid",
        gap: 18,
      }}
    >
      <Select
        label="Employee"
        value={
          formData.employeeUuid
        }
        options={
          employeeOptions
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,
              employeeUuid:
                event.target.value,
            }),
          )
        }
      />

      <Select
        label="Project Role"
        value={
          formData.projectRoleUuid
        }
        options={
          projectRoleOptions
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,
              projectRoleUuid:
                event.target.value,
            }),
          )
        }
      />

      <Input
        label="Remarks"
        value={
          formData.remarks
        }
        placeholder="Enter assignment remarks"
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,
              remarks:
                event.target.value,
            }),
          )
        }
      />
    </div>
  );
};

export default ProjectMemberForm;