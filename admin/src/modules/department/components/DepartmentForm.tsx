import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";

import type { DepartmentFormData } from "../types/department.types";

import styles from "./DepartmentForm.module.css";

interface Props {
  formData: DepartmentFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<DepartmentFormData>
  >;
}

const DepartmentForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="Department Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <Input
        label="Department Code"
        value={formData.code}
        onChange={(e) =>
          setFormData({
            ...formData,
            code: e.target.value,
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

export default DepartmentForm;