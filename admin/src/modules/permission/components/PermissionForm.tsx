import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";
import Textarea from "@/shared/components/Textarea";

import type {
  PermissionFormData,
  PermissionModule,
  PermissionStatus,
} from "../types/permission.types";

import styles from "./PermissionForm.module.css";

interface Props {
  formData: PermissionFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<PermissionFormData>
  >;
}

const moduleOptions = [
  "DASHBOARD",
  "COMPANY",
  "ORGANIZATION",
  "BRANCH",
  "ROLE",
  "USER",
  "DEPARTMENT",
  "DESIGNATION",
  "EMPLOYEE",
  "CLIENT",
  "VENDOR",
  "PROJECT",
  "PROJECT_CATEGORY",
  "TASK",
  "INVENTORY",
  "PURCHASE",
  "FINANCE",
  "REPORT",
  "SETTINGS",
].map((module) => ({
  label: module
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    ),

  value: module,
}));

const statusOptions = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
  },
];

const PermissionForm = ({
  formData,
  setFormData,
}: Props) => {
  const handleModuleChange = (
    module: PermissionModule,
  ) => {
    setFormData((previous) => ({
      ...previous,

      module,

      code:
        previous.code ||
        `${module
          .toLowerCase()
          .replaceAll("_", "_")}.`,
    }));
  };

  return (
    <div className={styles.form}>
      <Select
        label="Module"
        name="module"
        placeholder="Select module"
        value={formData.module}
        options={moduleOptions}
        onChange={(event) =>
          handleModuleChange(
            event.target
              .value as PermissionModule,
          )
        }
      />

      <Input
        label="Permission Name"
        name="name"
        placeholder="Example: Create Employee"
        value={formData.name}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              name:
                event.target.value,
            }),
          )
        }
      />

      <Input
        label="Permission Code"
        name="code"
        placeholder="Example: employee.create"
        value={formData.code}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              code:
                event.target.value
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "",
                  ),
            }),
          )
        }
      />

      <Textarea
        label="Description"
        name="description"
        rows={4}
        value={
          formData.description ??
          ""
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              description:
                event.target.value,
            }),
          )
        }
      />

      <Select
        label="Status"
        name="status"
        showPlaceholder={false}
        value={
          formData.status ??
          "ACTIVE"
        }
        options={statusOptions}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              status:
                event.target
                  .value as PermissionStatus,
            }),
          )
        }
      />
    </div>
  );
};

export default PermissionForm;