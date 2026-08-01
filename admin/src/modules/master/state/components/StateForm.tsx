import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  StateFormData,
} from "../types/state.types";

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
  const handleChange = (
    name: keyof StateFormData,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <div className={styles.form}>
      <Input
        label="State Name"
        value={formData.name}
        required
        onChange={(e) =>
          handleChange(
            "name",
            e.target.value,
          )
        }
      />

      <Input
        label="State Code"
        value={formData.code}
        required
        maxLength={10}
        onChange={(e) =>
          handleChange(
            "code",
            e.target.value
              .toUpperCase()
              .replace(/\s+/g, ""),
          )
        }
      />

      <Input
        label="GST Code"
        value={formData.gstCode}
        maxLength={2}
        onChange={(e) =>
          handleChange(
            "gstCode",
            e.target.value.replace(
              /\D/g,
              "",
            ),
          )
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
          handleChange(
            "status",
            e.target.value,
          )
        }
      />
    </div>
  );
};

export default StateForm;