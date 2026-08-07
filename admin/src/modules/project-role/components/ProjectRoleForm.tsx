import type {
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  ProjectRoleFormData,
  Status,
} from "../types/project-role.types";

import styles from "./ProjectRoleForm.module.css";

interface Props {
  formData: ProjectRoleFormData;

  setFormData: Dispatch<
    SetStateAction<ProjectRoleFormData>
  >;

  isEdit?: boolean;
}

const ProjectRoleForm = ({
  formData,
  setFormData,
  isEdit = false,
}: Props) => {
  return (
    <div
      className={
        styles.form
      }
    >
      <Input
        label="Role Name"
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
        label="Code"
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

      <Input
        label="Description"
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

      <Input
        type="number"
        label="Sort Order"
        value={String(
          formData.sortOrder ?? 0,
        )}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,
              sortOrder:
                Number(
                  event.target.value,
                ),
            }),
          )
        }
      />

      <div
        className={
          styles.checkboxWrapper
        }
      >
        <label
          className={
            styles.checkboxLabel
          }
        >
          <input
            type="checkbox"
            checked={
              formData.isSingleAssignee
            }
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  isSingleAssignee:
                    event.target.checked,
                }),
              )
            }
          />

          <span>
            Allow only one active member per project
          </span>
        </label>
      </div>

      {isEdit && (
        <Select
          label="Status"
          value={
            formData.status ??
            "ACTIVE"
          }
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
      )}
    </div>
  );
};

export default ProjectRoleForm;