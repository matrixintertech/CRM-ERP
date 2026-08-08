

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import { useStates } from "../../state/hooks/useStates";

import type {
  CityFormData,
} from "../types/city.types";

import styles from "./CityForm.module.css";

interface Props {
  formData: CityFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<CityFormData>
  >;
}

const CityForm = ({
  formData,
  setFormData,
}: Props) => {


const {
  dropdown: states,
} = useStates();

  const handleChange = (
    field: keyof CityFormData,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div className={styles.form}>
      <Select
        label="State"
        value={formData.stateUuid}
        required
        options={
            states.map(
              (state) => ({
                label: state.name,
                value: state.uuid,
              }),
            )
}
        onChange={(e) =>
          handleChange(
            "stateUuid",
            e.target.value,
          )
        }
      />

      <Input
        label="City Name"
        value={formData.name}
        required
        onChange={(e) =>
          handleChange(
            "name",
            e.target.value,
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

export default CityForm;