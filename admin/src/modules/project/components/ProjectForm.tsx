import type {
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";

import type {
  ProjectFormData,
  Status,
} from "../types/project.types";

import styles from "./ProjectForm.module.css";

interface Option {
  label: string;
  value: string;
}

interface DropdownItem {
  uuid: string;
  name: string;
}

interface Props {
  formData: ProjectFormData;

  setFormData: Dispatch<
    SetStateAction<ProjectFormData>
  >;

  clientOptions: DropdownItem[];
  categoryOptions: Option[];
  branchOptions: Option[];
  stateOptions: DropdownItem[];
  cityOptions: DropdownItem[];

  onStateChange: (
    stateUuid: string,
  ) => Promise<void>;

  isEdit?: boolean;
}

const ProjectForm = ({
  formData,
  setFormData,
  clientOptions,
  categoryOptions,
  branchOptions,
  stateOptions,
  cityOptions,
  onStateChange,
  isEdit = false,
}: Props) => {
  const mappedClientOptions =
    clientOptions.map((item) => ({
      label: item.name,
      value: item.uuid,
    }));

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
      <Select
        label="Client"
        value={formData.clientUuid}
        options={mappedClientOptions}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            clientUuid:
              event.target.value,
          }))
        }
      />

      <Select
        label="Project Category"
        value={formData.categoryUuid}
        options={categoryOptions}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            categoryUuid:
              event.target.value,
          }))
        }
      />

      <Select
        label="Branch"
        value={
          formData.organizationUnitUuid
        }
        options={branchOptions}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            organizationUnitUuid:
              event.target.value,
          }))
        }
      />

      <Input
        label="Project Name"
        value={formData.name}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            name: event.target.value,
          }))
        }
      />

      <Select
        label="State"
        value={formData.stateUuid ?? ""}
        options={mappedStateOptions}
        onChange={async (event) => {
          const stateUuid =
            event.target.value;

          setFormData((previous) => ({
            ...previous,
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
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            cityUuid:
              event.target.value,
          }))
        }
      />

      <Input
        label="Pincode"
        value={formData.pincode ?? ""}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            pincode:
              event.target.value,
          }))
        }
      />

      <Input
        label="Address"
        value={formData.address ?? ""}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            address:
              event.target.value,
          }))
        }
      />

      <Input
        type="date"
        label="Start Date"
        value={formData.startDate ?? ""}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            startDate:
              event.target.value,
          }))
        }
      />

      <Input
        type="date"
        label="Expected End Date"
        value={
          formData.expectedEndDate ??
          ""
        }
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            expectedEndDate:
              event.target.value,
          }))
        }
      />

      <Input
        label="Remarks"
        value={formData.remarks ?? ""}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            remarks:
              event.target.value,
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
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,
              status:
                event.target
                  .value as Status,
            }))
          }
        />
      )}
    </div>
  );
};

export default ProjectForm;