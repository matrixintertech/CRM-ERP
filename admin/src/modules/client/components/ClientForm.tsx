import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type { CreateClientDto } from "../types/client.types";

import styles from "./ClientForm.module.css";

interface Option {
  label: string;
  value: string;
}

interface Props {
  formData: CreateClientDto;

  setFormData: React.Dispatch<
    React.SetStateAction<CreateClientDto>
  >;

  stateOptions: Option[];
  cityOptions: Option[];

  isEdit?: boolean;
}

const ClientForm = ({
  formData,
  setFormData,
  stateOptions,
  cityOptions,
  isEdit = false,
}: Props) => {
  return (
    <div className={styles.form}>
      {/* Basic Information */}

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

      {/* Tax Information */}

      <Input
        label="GST Number"
        value={formData.gstNumber ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            gstNumber: e.target.value.toUpperCase(),
          }))
        }
      />

      <Input
        label="PAN Number"
        value={formData.panNumber ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            panNumber: e.target.value.toUpperCase(),
          }))
        }
      />

      {/* Address */}

      <Select
        label="State"
        value={formData.stateUuid ?? ""}
        options={stateOptions}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            stateUuid: e.target.value,
            cityUuid: "",
          }))
        }
      />

      <Select
        label="City"
        value={formData.cityUuid ?? ""}
        options={cityOptions}
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
          value={formData.status ?? "ACTIVE"}
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
      )}
    </div>
  );
};

export default ClientForm;