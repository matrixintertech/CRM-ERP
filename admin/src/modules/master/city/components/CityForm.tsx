import { useEffect } from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import { useStates } from "../../state/hooks/useStates";
import type { CityFormData } from "../types/city.types";

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
    dropdown,
    fetchDropdown,
  } = useStates();

  useEffect(() => {
    fetchDropdown();
  }, [fetchDropdown]);

  return (
    <div className={styles.form}>
      <Select
        label="State"
        value={formData.stateUuid}
        options={dropdown.map((state) => ({
          label: state.name,
          value: state.uuid,
        }))}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            stateUuid: e.target.value,
          }))
        }
      />

      <Input
        label="City Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            name: e.target.value,
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

export default CityForm;