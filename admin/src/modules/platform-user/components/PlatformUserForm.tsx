import type { Dispatch, SetStateAction } from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type { PlatformUserFormData } from "../types/platform-user.types";

import styles from "./PlatformUserForm.module.css";

interface Props {
  formData: PlatformUserFormData;

  setFormData: Dispatch<SetStateAction<PlatformUserFormData>>;

  isEdit: boolean;
}

const PlatformUserForm = ({ formData, setFormData, isEdit }: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="Display Name"
        value={formData.displayName}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            displayName: event.target.value,
          }))
        }
        required
      />

      <Input
        type="email"
        label="Email"
        value={formData.email}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            email: event.target.value,
          }))
        }
        required
      />

      <Input
        label="Mobile"
        value={formData.mobile}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            mobile: event.target.value,
          }))
        }
      />

      {isEdit && (
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
            {
              label: "Suspended",
              value: "SUSPENDED",
            },
          ]}
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,
              status: event.target.value as PlatformUserFormData["status"],
            }))
          }
        />
      )}
    </div>
  );
};

export default PlatformUserForm;
