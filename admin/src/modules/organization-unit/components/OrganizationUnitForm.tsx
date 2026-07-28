import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type { OrganizationUnitFormData } from "../types/organization-unit.types";

import styles from "./OrganizationUnitForm.module.css";

interface Props {
  formData: OrganizationUnitFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<OrganizationUnitFormData>
  >;
}

const typeOptions = [
  {
    label: "Head Office",
    value: "HEAD_OFFICE",
  },
  {
    label: "Region",
    value: "REGION",
  },
  {
    label: "Branch",
    value: "BRANCH",
  },
  {
    label: "Office",
    value: "OFFICE",
  },
];

const parentOptions = [
  {
    label: "None",
    value: "",
  },
];

const OrganizationUnitForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
      <Select
        label="Type"
        options={typeOptions}
        value={formData.type}
        onChange={(e) =>
          setFormData({
            ...formData,
            type: e.target.value as any,
          })
        }
      />

      <Select
        label="Parent Unit"
        options={parentOptions}
        value={
          formData.parentId?.toString() ??
          ""
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            parentId: e.target.value
              ? Number(e.target.value)
              : undefined,
          })
        }
      />

      <Input
        label="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <Input
        label="Code"
        value={formData.code}
        onChange={(e) =>
          setFormData({
            ...formData,
            code: e.target.value,
          })
        }
      />

      <Input
        label="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value,
          })
        }
      />

      <Input
        label="Mobile"
        value={formData.mobile}
        onChange={(e) =>
          setFormData({
            ...formData,
            mobile: e.target.value,
          })
        }
      />

      <Input
        label="Address Line 1"
        value={formData.addressLine1}
        onChange={(e) =>
          setFormData({
            ...formData,
            addressLine1:
              e.target.value,
          })
        }
      />

      <Input
        label="Address Line 2"
        value={formData.addressLine2}
        onChange={(e) =>
          setFormData({
            ...formData,
            addressLine2:
              e.target.value,
          })
        }
      />

      <Input
        label="City"
        value={formData.city}
        onChange={(e) =>
          setFormData({
            ...formData,
            city: e.target.value,
          })
        }
      />

      <Input
        label="State"
        value={formData.state}
        onChange={(e) =>
          setFormData({
            ...formData,
            state: e.target.value,
          })
        }
      />

      <Input
        label="Country"
        value={formData.country}
        onChange={(e) =>
          setFormData({
            ...formData,
            country: e.target.value,
          })
        }
      />

      <Input
        label="Pincode"
        value={formData.pincode}
        onChange={(e) =>
          setFormData({
            ...formData,
            pincode:
              e.target.value,
          })
        }
      />
    </div>
  );
};

export default OrganizationUnitForm;