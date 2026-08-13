import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";
import Textarea from "@/shared/components/Textarea";

import type {
  PermissionFormData,
  PermissionModule,
  PermissionScope,
  PermissionStatus,
  PermissionType,
} from "../types/permission.types";

import styles from "./PermissionForm.module.css";

interface Props {
  formData: PermissionFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<PermissionFormData>
  >;
}

const typeOptions = [
  {
    label: "Company",
    value: "COMPANY",
  },
  {
    label: "Platform",
    value: "PLATFORM",
  },
];

const moduleOptions = [
  "DASHBOARD",
  "COMPANY",
  "ORGANIZATION",
  "BRANCH",
  "ROLE",
  "USER",
  "DEPARTMENT",
  "DESIGNATION",
  "EMPLOYEE",
  "CLIENT",
  "VENDOR",
  "PROJECT",
  "PROJECT_CATEGORY",
  "PROJECT_ROLE",
  "TASK",
  "INVENTORY",
  "PURCHASE",
  "FINANCE",
  "REPORT",
  "SETTINGS",
].map((module) => ({
  label: module
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    ),

  value: module,
}));

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

const scopeOptions: {
  label: string;
  value: PermissionScope;
}[] = [
  {
    label: "Own",
    value: "OWN",
  },
  {
    label: "Team",
    value: "TEAM",
  },
  {
    label: "Organization Unit",
    value: "ORGANIZATION_UNIT",
  },
  {
    label: "Project",
    value: "PROJECT",
  },
  {
    label: "Company",
    value: "COMPANY",
  },
];

const PermissionForm = ({
  formData,
  setFormData,
}: Props) => {
  const handleTypeChange = (
    type: PermissionType,
  ) => {
    setFormData(
      (previous) => {
        const currentScopes =
          previous.allowedScopes ?? [];

        return {
          ...previous,

          type,

          /*
           * PLATFORM permissions
           * scope-less hote hain.
           *
           * COMPANY par switch karte waqt
           * agar koi scope selected nahi hai
           * to COMPANY default select hoga.
           */
          allowedScopes:
            type === "PLATFORM"
              ? []
              : currentScopes.length > 0
                ? currentScopes
                : ["COMPANY"],
        };
      },
    );
  };

  const handleModuleChange = (
    module: PermissionModule,
  ) => {
    setFormData(
      (previous) => ({
        ...previous,

        module,

        code:
          previous.code ||
          `${module.toLowerCase()}.`,
      }),
    );
  };

  const handleScopeChange = (
    scope: PermissionScope,
  ) => {
    setFormData(
      (previous) => {
        const currentScopes =
          previous.allowedScopes ?? [];

        const exists =
          currentScopes.includes(
            scope,
          );

        return {
          ...previous,

          allowedScopes:
            exists
              ? currentScopes.filter(
                  (
                    existingScope,
                  ) =>
                    existingScope !==
                    scope,
                )
              : [
                  ...currentScopes,
                  scope,
                ],
        };
      },
    );
  };

  return (
    <div className={styles.form}>
      <Select
        label="Permission Type"
        name="type"
        showPlaceholder={false}
        value={formData.type}
        options={typeOptions}
        onChange={(event) =>
          handleTypeChange(
            event.target
              .value as PermissionType,
          )
        }
      />

      <Select
        label="Module"
        name="module"
        placeholder="Select module"
        value={formData.module}
        options={moduleOptions}
        onChange={(event) =>
          handleModuleChange(
            event.target
              .value as PermissionModule,
          )
        }
      />

      <Input
        label="Permission Name"
        name="name"
        placeholder="Example: View Project Categories"
        value={formData.name}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              name:
                event.target.value,
            }),
          )
        }
      />

      <Input
        label="Permission Code"
        name="code"
        placeholder="Example: company.project_category.view"
        value={formData.code}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              code:
                event.target.value
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "",
                  ),
            }),
          )
        }
      />

      {formData.type ===
        "COMPANY" && (
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Allowed Scopes
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {scopeOptions.map(
              (
                option,
              ) => {
                const checked =
                  (
                    formData.allowedScopes ??
                    []
                  ).includes(
                    option.value,
                  );

                return (
                  <label
                    key={
                      option.value
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 6,
                      cursor:
                        "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        checked
                      }
                      onChange={() =>
                        handleScopeChange(
                          option.value,
                        )
                      }
                    />

                    <span>
                      {
                        option.label
                      }
                    </span>
                  </label>
                );
              },
            )}
          </div>

          {(
            formData.allowedScopes
              ?.length ??
            0
          ) === 0 && (
            <div
              style={{
                fontSize: 12,
                marginTop: 6,
              }}
            >
              Select at least one scope.
            </div>
          )}
        </div>
      )}

      <Textarea
        label="Description"
        name="description"
        rows={4}
        value={
          formData.description ??
          ""
        }
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              description:
                event.target.value,
            }),
          )
        }
      />

      <Select
        label="Status"
        name="status"
        showPlaceholder={false}
        value={
          formData.status ??
          "ACTIVE"
        }
        options={statusOptions}
        onChange={(event) =>
          setFormData(
            (previous) => ({
              ...previous,

              status:
                event.target
                  .value as PermissionStatus,
            }),
          )
        }
      />
    </div>
  );
};

export default PermissionForm;