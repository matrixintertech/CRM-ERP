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


const companyModules: PermissionModule[] = [
  "DASHBOARD",
  "COMPANY",
  "ORGANIZATION",
  "BRANCH",
  "ROLE",
  "USER",
  "PERMISSION",
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
];


const platformModules: PermissionModule[] = [
  "PLATFORM_COMPANY",
  "PLATFORM_ROLE",
  "PLATFORM_USER",
  "PLATFORM_PERMISSION",
];


const formatModuleLabel = (
  module: PermissionModule,
) =>
  module
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );


const toModuleOptions = (
  modules: PermissionModule[],
) =>
  modules.map((module) => ({
    label:
      formatModuleLabel(
        module,
      ),

    value:
      module,
  }));


const companyModuleOptions =
  toModuleOptions(
    companyModules,
  );

const platformModuleOptions =
  toModuleOptions(
    platformModules,
  );


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
    value:
      "ORGANIZATION_UNIT",
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


/*
 * Permission code prefix depends
 * on authorization boundary/module.
 */
const getPermissionCodePrefix = (
  type: PermissionType,
  module: PermissionModule,
): string => {
  if (
    type === "PLATFORM"
  ) {
    switch (module) {
      case "PLATFORM_COMPANY":
        return "platform.company.";

      case "PLATFORM_ROLE":
        return "platform.platform_role.";

      case "PLATFORM_USER":
        return "platform.user.";

      case "PLATFORM_PERMISSION":
        return "platform.permission.";

      default:
        return "platform.";
    }
  }

  return `company.${module
    .toLowerCase()}.`;
};


const PermissionForm = ({
  formData,
  setFormData,
}: Props) => {
  const moduleOptions =
    formData.type ===
    "PLATFORM"
      ? platformModuleOptions
      : companyModuleOptions;


  const handleTypeChange = (
    type: PermissionType,
  ) => {
    setFormData(
      (previous) => {
        const currentScopes =
          previous.allowedScopes ??
          [];

        const validModules =
          type === "PLATFORM"
            ? platformModules
            : companyModules;

        const currentModuleIsValid =
          validModules.includes(
            previous.module,
          );


        return {
          ...previous,

          type,

          /*
           * Selected module dusre
           * permission boundary ka hai
           * to reset kar do.
           */
          module:
            currentModuleIsValid
              ? previous.module
              : ("" as PermissionModule),

          /*
           * Module reset hua to old
           * permission code bhi clear.
           */
          code:
            currentModuleIsValid
              ? previous.code
              : "",

          /*
           * PLATFORM permissions
           * scope-less hain.
           *
           * COMPANY par switch karte
           * waqt default COMPANY scope.
           */
          allowedScopes:
            type === "PLATFORM"
              ? []
              : currentScopes.length >
                  0
                ? currentScopes
                : [
                    "COMPANY",
                  ],
        };
      },
    );
  };


  const handleModuleChange = (
    module: PermissionModule,
  ) => {
    setFormData(
      (previous) => {
        const oldPrefix =
          previous.module
            ? getPermissionCodePrefix(
                previous.type,
                previous.module,
              )
            : "";

        const newPrefix =
          getPermissionCodePrefix(
            previous.type,
            module,
          );

        /*
         * Agar code empty hai ya sirf
         * old auto-generated prefix hai,
         * to new prefix set karo.
         *
         * User ne manually action/code
         * type kar diya hai to overwrite
         * nahi karenge.
         */
        const shouldReplaceCode =
          !previous.code ||
          previous.code ===
            oldPrefix;

        return {
          ...previous,

          module,

          code:
            shouldReplaceCode
              ? newPrefix
              : previous.code,
        };
      },
    );
  };


  const handleScopeChange = (
    scope: PermissionScope,
  ) => {
    setFormData(
      (previous) => {
        const currentScopes =
          previous.allowedScopes ??
          [];

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
    <div
      className={
        styles.form
      }
    >
      <Select
        label="Permission Type"
        name="type"
        showPlaceholder={
          false
        }
        value={
          formData.type
        }
        options={
          typeOptions
        }
        onChange={(
          event,
        ) =>
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
        value={
          formData.module
        }
        options={
          moduleOptions
        }
        onChange={(
          event,
        ) =>
          handleModuleChange(
            event.target
              .value as PermissionModule,
          )
        }
      />


      <Input
        label="Permission Name"
        name="name"
        placeholder={
          formData.type ===
          "PLATFORM"
            ? "Example: View Platform Companies"
            : "Example: View Project Categories"
        }
        value={
          formData.name
        }
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
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
        placeholder={
          formData.type ===
          "PLATFORM"
            ? "Example: platform.company.view"
            : "Example: company.project_category.view"
        }
        value={
          formData.code
        }
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
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
              display:
                "flex",
              flexWrap:
                "wrap",
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
              Select at least one
              scope.
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
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
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
        showPlaceholder={
          false
        }
        value={
          formData.status ??
          "ACTIVE"
        }
        options={
          statusOptions
        }
        onChange={(
          event,
        ) =>
          setFormData(
            (
              previous,
            ) => ({
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