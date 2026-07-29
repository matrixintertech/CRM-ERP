import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type { StateFormData } from "../types/state.types";

import styles from "./StateForm.module.css";

interface Props {
  formData: StateFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<StateFormData>
  >;
}

const StateForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="State Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />

      <Input
        label="State Code"
        value={formData.code}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            code: e.target.value
              .toUpperCase()
              .replace(/\s+/g, ""),
          }))
        }
      />

      <Input
        label="GST Code"
        value={formData.gstCode}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            gstCode: e.target.value,
          }))
        }
      />

      <Select
        label="Status"
        value={formData.status}
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
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            status: e.target.value as
              | "ACTIVE"
              | "INACTIVE",
          }))
        }
      />
    </div>
  );
};

export default StateForm;