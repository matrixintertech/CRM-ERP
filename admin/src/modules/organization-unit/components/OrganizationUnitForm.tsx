import type { Dispatch, SetStateAction } from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import { useCities } from "../../master/city/hooks/useCities";
import { useStates } from "../../master/state/hooks/useStates";

import type {
  OrganizationUnit,
  OrganizationUnitFormData,
  OrganizationUnitType,
} from "../types/organization-unit.types";

import styles from "./OrganizationUnitForm.module.css";

interface Props {
  organizationUnits: OrganizationUnit[];

  formData: OrganizationUnitFormData;

  setFormData: Dispatch<SetStateAction<OrganizationUnitFormData>>;

  editingUuid?: string | null;
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

const statusOptions = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
  },
];

const OrganizationUnitForm = ({
  organizationUnits,
  formData,
  setFormData,
  editingUuid,
}: Props) => {
  const { dropdown: stateOptions } = useStates();

  const { dropdownCities: cities } = useCities(
    {},
    formData.stateUuid || undefined,
  );

  const handleChange = (
    field: keyof OrganizationUnitFormData,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleStateChange = (stateUuid: string) => {
    setFormData((previous) => ({
      ...previous,
      stateUuid,
      cityUuid: "",
    }));
  };

  const allowedParents = organizationUnits.filter((unit) => {
    if (unit.uuid === editingUuid) {
      return false;
    }

    switch (formData.type) {
      case "HEAD_OFFICE":
        return false;

      case "REGION":
        return unit.type === "HEAD_OFFICE";

      case "BRANCH":
        return unit.type === "HEAD_OFFICE" || unit.type === "REGION";

      case "OFFICE":
        return unit.type === "BRANCH";

      default:
        return false;
    }
  });

  const parentOptions = allowedParents.map((unit) => ({
    label: `${unit.name} (${unit.type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase())})`,

    value: unit.uuid,
  }));

  const handleTypeChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,

      type: value as OrganizationUnitType,

      parentUuid: undefined,
    }));
  };

  return (
    <div className={styles.formGrid}>
      <Select
        label="Type"
        name="type"
        value={formData.type}
        showPlaceholder={false}
        options={typeOptions}
        onChange={(event) => handleTypeChange(event.target.value)}
      />

      {formData.type !== "HEAD_OFFICE" && (
        <Select
          label="Parent Unit"
          name="parentUuid"
          placeholder="Select parent unit"
          value={formData.parentUuid ?? ""}
          options={parentOptions}
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,

              parentUuid: event.target.value || undefined,
            }))
          }
        />
      )}

      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={(event) => handleChange("name", event.target.value)}
      />

      <Input
        label="Code"
        name="code"
        value={formData.code}
        onChange={(event) =>
          handleChange(
            "code",
            event.target.value.toUpperCase().replace(/\s+/g, ""),
          )
        }
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(event) => handleChange("email", event.target.value)}
      />

      <Input
        label="Mobile"
        name="mobile"
        value={formData.mobile}
        onChange={(event) => handleChange("mobile", event.target.value)}
      />

      <Input
        label="Address Line 1"
        name="addressLine1"
        value={formData.addressLine1}
        onChange={(event) => handleChange("addressLine1", event.target.value)}
      />

      <Input
        label="Address Line 2"
        name="addressLine2"
        value={formData.addressLine2}
        onChange={(event) => handleChange("addressLine2", event.target.value)}
      />

      <Select
        label="State"
        name="stateUuid"
        placeholder="Select state"
        value={formData.stateUuid ?? ""}
        options={stateOptions.map((state) => ({
          label: state.name,
          value: state.uuid,
        }))}
        onChange={(event) => handleStateChange(event.target.value)}
      />

      <Select
        label="City"
        name="cityUuid"
        placeholder={formData.stateUuid ? "Select city" : "Select state first"}
        value={formData.cityUuid ?? ""}
        options={cities.map((city) => ({
          label: city.name,
          value: city.uuid,
        }))}
        onChange={(event) => handleChange("cityUuid", event.target.value)}
      />

      <Input
        label="Country"
        name="country"
        value={formData.country}
        onChange={(event) => handleChange("country", event.target.value)}
      />

      <Input
        label="Pincode"
        name="pincode"
        value={formData.pincode}
        onChange={(event) => handleChange("pincode", event.target.value)}
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        showPlaceholder={false}
        options={statusOptions}
        onChange={(event) => handleChange("status", event.target.value)}
      />
    </div>
  );
};

export default OrganizationUnitForm;
