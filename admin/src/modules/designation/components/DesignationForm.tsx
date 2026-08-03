import Select from "@/shared/components/Select";
import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";

import type {
  DesignationFormData,
} from "../types/designation.types";

import type {
  Department,
} from "../../department/types/department.types";

import styles from "./DesignationForm.module.css";

interface Props {
  departments: Department[];

  formData: DesignationFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<DesignationFormData>
  >;
}

const DesignationForm = ({
  departments,
  formData,
  setFormData,
}: Props) => {

  const departmentOptions =
  departments
    .filter(
      (department) =>
        department.status === "ACTIVE",
    )
    .map((department) => ({
      label: `${
        department.organizationUnit?.name ??
        "Unknown Location"
      } (${
        department.organizationUnit?.code ??
        "-"
      }) / ${department.name}`,

      value: department.uuid,
    }));

  return (
    <div className={styles.form}>

      <Select
        label="Location / Department"
        name="departmentUuid"
        placeholder="Select location and department"
        value={formData.departmentUuid}
        options={departmentOptions}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            departmentUuid:
              event.target.value,
          }))
        }
      />

      <Input
        label="Designation Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <Input
        label="Designation Code"
        value={formData.code}
        onChange={(e) =>
          setFormData({
            ...formData,
            code: e.target.value
              .toUpperCase()
              .replace(/\s+/g, ""),
          })
        }
      />

      <Textarea
  label="Description"
  rows={4}
  value={
    formData.description ?? ""
  }
  onChange={(e) =>
    setFormData({
      ...formData,
      description:
        e.target.value,
    })
  }
/>

    </div>
  );
};

export default DesignationForm;