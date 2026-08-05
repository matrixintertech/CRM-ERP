import type {
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  ProjectCategoryFormData,
  Status,
} from "../types/project-category.types";

import styles from "./ProjectCategoryForm.module.css";

interface Props {
  formData:
    ProjectCategoryFormData;

  setFormData:
    Dispatch<
      SetStateAction<
        ProjectCategoryFormData
      >
    >;

  isEdit?: boolean;
}

const ProjectCategoryForm = ({
  formData,
  setFormData,
  isEdit = false,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="Category Name"
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

      <div
        className={
          styles.colorWrapper
        }
      >
        <label>
          Color
        </label>

        <input
          type="color"
          value={
            formData.color ??
            "#3B82F6"
          }
          onChange={(event) =>
            setFormData(
              (previous) => ({
                ...previous,
                color:
                  event.target.value,
              }),
            )
          }
        />
      </div>

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

export default ProjectCategoryForm;