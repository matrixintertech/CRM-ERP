import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";

import type { DesignationFormData } from "../types/designation.types";

import styles from "./DesignationForm.module.css";

interface Props {
  formData: DesignationFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<DesignationFormData>
  >;
}

const DesignationForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
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

export default DesignationForm;