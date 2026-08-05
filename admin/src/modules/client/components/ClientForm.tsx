import type {
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  CityOption,
  ClientFormData,
  ClientStatus,
  StateOption,
} from "../types/client.types";

import styles from "./ClientForm.module.css";

interface Props {
  formData: ClientFormData;

  setFormData: Dispatch<
    SetStateAction<ClientFormData>
  >;

  stateOptions: StateOption[];
  cityOptions: CityOption[];

  onStateChange: (
    stateUuid: string,
  ) => Promise<void>;

  isEdit?: boolean;
}

const ClientForm = ({
  formData,
  setFormData,
  stateOptions,
  cityOptions,
  onStateChange,
  isEdit = false,
}: Props) => {
  const mappedStateOptions =
    stateOptions.map((item) => ({
      label: item.name,
      value: item.uuid,
    }));

  const mappedCityOptions =
    cityOptions.map((item) => ({
      label: item.name,
      value: item.uuid,
    }));

  return (
    <div className={styles.form}>
      <Input
        label="Client Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />

      <Input
        label="Client Code"
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
        label="Contact Person"
        value={formData.contactName}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            contactName: e.target.value,
          }))
        }
      />

      <Input
        label="Mobile"
        value={formData.mobile}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            mobile: e.target.value,
          }))
        }
      />

      <Input
        label="Email"
        type="email"
        value={formData.email ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
      />

      <Input
        label="GST Number"
        value={formData.gstNumber ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            gstNumber:
              e.target.value.toUpperCase(),
          }))
        }
      />

      <Input
        label="PAN Number"
        value={formData.panNumber ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            panNumber:
              e.target.value.toUpperCase(),
          }))
        }
      />

      <Select
        label="State"
        value={formData.stateUuid ?? ""}
        options={mappedStateOptions}
        onChange={async (e) => {
          const stateUuid =
            e.target.value;

          setFormData((prev) => ({
            ...prev,
            stateUuid,
            cityUuid: "",
          }));

          await onStateChange(
            stateUuid,
          );
        }}
      />

      <Select
        label="City"
        value={formData.cityUuid ?? ""}
        options={mappedCityOptions}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            cityUuid: e.target.value,
          }))
        }
      />

      <Input
        label="Pincode"
        value={formData.pincode ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            pincode: e.target.value,
          }))
        }
      />

      <Input
        label="Address"
        value={formData.address ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            address: e.target.value,
          }))
        }
      />

      <Input
        label="Remarks"
        value={formData.remarks ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            remarks: e.target.value,
          }))
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
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              status:
                e.target
                  .value as ClientStatus,
            }))
          }
        />
      )}
    </div>
  );
};

export default ClientForm;