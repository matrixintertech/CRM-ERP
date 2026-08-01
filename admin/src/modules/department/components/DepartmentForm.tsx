import Select from "@/shared/components/Select";
import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";

import type {
  DepartmentFormData,
} from "../types/department.types";

import type {
  OrganizationUnit,
} from "../../organization-unit/types/organization-unit.types";

import styles from "./DepartmentForm.module.css";

interface Props {
  organizationUnits: OrganizationUnit[];

  formData: DepartmentFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<DepartmentFormData>
  >;
}

const DepartmentForm = ({
  organizationUnits,
  formData,
  setFormData,
}: Props) => {
  const organizationUnitOptions =
    organizationUnits
      .filter(
        (unit) =>
          unit.status === "ACTIVE",
      )
      .map((unit) => ({
        label: `${unit.name} (${unit.type
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(
            /\b\w/g,
            (character) =>
              character.toUpperCase(),
          )})`,

        value: unit.uuid,
      }));

  return (
    <div className={styles.form}>
      <Select
        label="Organization Unit"
        name="organizationUnitUuid"
        placeholder="Select organization unit"
        value={
          formData.organizationUnitUuid
        }
        options={
          organizationUnitOptions
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              organizationUnitUuid:
                event.target.value,
            }),
          )
        }
      />

      <Input
        label="Department Name"
        name="name"
        required
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
        label="Department Code"
        name="code"
        required
        maxLength={20}
        value={formData.code}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              code:
                event.target.value
                  .toUpperCase()
                  .replace(/\s+/g, ""),
            }),
          )
        }
      />

      <Textarea
        label="Description"
        name="description"
        rows={4}
        value={
          formData.description ?? ""
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
    </div>
  );
};

export default DepartmentForm;