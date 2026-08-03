import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";
import Textarea from "@/shared/components/Textarea";

import type {
  RoleFormData,
  RoleStatus,
} from "../types/role.types";

import styles from "./RoleForm.module.css";

interface Props {
  formData: RoleFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<RoleFormData>
  >;

  isEdit?: boolean;
}

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

const RoleForm = ({
  formData,
  setFormData,
  isEdit,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="Role Name"
        name="name"
        placeholder="Example: HR Manager"
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
        label="Role Code"
        name="code"
        placeholder="Example: HR_MANAGER"
        value={formData.code}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              code:
                event.target.value
                  .toUpperCase()
                  .replace(
                    /\s+/g,
                    "_",
                  ),
            }),
          )
        }
      />

      <Textarea
        label="Description"
        name="description"
        rows={4}
        value={formData.description}
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

      {isEdit && (
        <Select
          label="Status"
          name="status"
          showPlaceholder={false}
          value={formData.status}
          options={statusOptions}
          onChange={(event) =>
            setFormData(
              (previous) => ({
                ...previous,

                status:
                  event.target
                    .value as RoleStatus,
              }),
            )
          }
        />
      )}
    </div>
  );
};

export default RoleForm;