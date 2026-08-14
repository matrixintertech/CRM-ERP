import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";
import Select from "@/shared/components/Select";
import Checkbox from "@/shared/components/Checkbox";

import {
  useModule,
} from "@/modules/module/hooks/useModules";

import type {
  Module,
} from "@/modules/module/types/module.types";

import type {
  SubscriptionPlanFormData,
} from "../types/subscription-plan.types";

import styles from "./SubscriptionPlanForm.module.css";


interface Props {
  initialValues?:
    Partial<SubscriptionPlanFormData>;

  onSubmit: (
    values:
      SubscriptionPlanFormData,
  ) => void | Promise<void>;
}


const defaultValues:
  SubscriptionPlanFormData = {
  name: "",
  code: "",
  description: "",

  planType: "PAID",

  billingCycle:
    "MONTHLY",

  price: 0,

  trialDays: 0,

  durationInDays:
    undefined,

  maxUsers:
    undefined,

  maxBranches:
    undefined,

  maxProjects:
    undefined,

  sortOrder: 0,

  isPublic: true,

  status: "ACTIVE",

  moduleIds: [],
};


const optionalNumberFields =
  new Set([
    "durationInDays",
    "maxUsers",
    "maxBranches",
    "maxProjects",
  ]);


const requiredNumberFields =
  new Set([
    "price",
    "trialDays",
    "sortOrder",
  ]);


const SubscriptionPlanForm = ({
  initialValues,
  onSubmit,
}: Props) => {
  const [
    form,
    setForm,
  ] =
    useState<SubscriptionPlanFormData>(
      {
        ...defaultValues,
      },
    );


  const [
    moduleSearch,
    setModuleSearch,
  ] =
    useState("");


  /*
   * useModule already uses React Query,
   * so separate fetchModules() call
   * is not required.
   */
  const {
    modules,
    loading:
      modulesLoading,
  } = useModule();


  useEffect(() => {
    setForm({
      ...defaultValues,
      ...initialValues,

      description:
        initialValues
          ?.description ??
        "",

      durationInDays:
        initialValues
          ?.durationInDays ??
        undefined,

      maxUsers:
        initialValues
          ?.maxUsers ??
        undefined,

      maxBranches:
        initialValues
          ?.maxBranches ??
        undefined,

      maxProjects:
        initialValues
          ?.maxProjects ??
        undefined,

      moduleIds:
        initialValues
          ?.moduleIds ??
        [],
    });
  }, [
    initialValues,
  ]);


  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;


    let nextValue:
      | string
      | number
      | boolean
      | undefined;


    if (
      type ===
      "checkbox"
    ) {
      nextValue = (
        event.target as HTMLInputElement
      ).checked;
    } else if (
      optionalNumberFields.has(
        name,
      )
    ) {
      nextValue =
        value === ""
          ? undefined
          : Math.max(
              0,
              Number(value) ||
                0,
            );
    } else if (
      requiredNumberFields.has(
        name,
      )
    ) {
      nextValue =
        Math.max(
          0,
          Number(value) ||
            0,
        );
    } else {
      nextValue =
        value;
    }


    setForm(
      (
        previous,
      ) => ({
        ...previous,

        [name]:
          nextValue,
      }),
    );
  };


  const handleModuleToggle = (
    moduleId: string,
  ) => {
    setForm(
      (
        previous,
      ) => ({
        ...previous,

        moduleIds:
          previous.moduleIds.includes(
            moduleId,
          )
            ? previous.moduleIds.filter(
                (
                  id,
                ) =>
                  id !==
                  moduleId,
              )
            : [
                ...previous.moduleIds,
                moduleId,
              ],
      }),
    );
  };


  /*
   * Backend new assignments ke
   * liye ACTIVE modules validate
   * karta hai.
   */
  const filteredModules =
    useMemo(
      () => {
        const search =
          moduleSearch
            .trim()
            .toLowerCase();

        return modules.filter(
          (
            module: Module,
          ) => {
            if (
              module.status !==
              "ACTIVE"
            ) {
              return false;
            }

            if (!search) {
              return true;
            }

            return (
              module.name
                .toLowerCase()
                .includes(
                  search,
                ) ||
              module.code
                .toLowerCase()
                .includes(
                  search,
                )
            );
          },
        );
      },
      [
        modules,
        moduleSearch,
      ],
    );


  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      await onSubmit({
        ...form,

        name:
          form.name.trim(),

        code:
          form.code
            .trim()
            .toUpperCase(),

        description:
          form.description
            ?.trim(),

        moduleIds: [
          ...new Set(
            form.moduleIds,
          ),
        ],
      });
    };


  return (
    <form
      id="subscription-plan-form"
      onSubmit={
        handleSubmit
      }
      className={
        styles.form
      }
    >
      <h4
        className={
          styles.section
        }
      >
        General Information
      </h4>


      <div
        className={
          styles.form2
        }
      >
        <Input
          label="Plan Name"
          name="name"
          value={
            form.name
          }
          onChange={
            handleChange
          }
          required
        />

        <Input
          label="Plan Code"
          name="code"
          value={
            form.code
          }
          onChange={
            handleChange
          }
          required
        />

        <div
          className={
            styles.fullWidth
          }
        >
          <Textarea
            label="Description"
            name="description"
            value={
              form.description ??
              ""
            }
            onChange={
              handleChange
            }
            rows={3}
          />
        </div>
      </div>


      <h4
        className={
          styles.section
        }
      >
        Pricing & Configuration
      </h4>


      <div
        className={
          styles.form3
        }
      >
        <Select
          label="Plan Type"
          name="planType"
          value={
            form.planType
          }
          onChange={
            handleChange
          }
          options={[
            {
              label:
                "Trial",
              value:
                "TRIAL",
            },
            {
              label:
                "Free",
              value:
                "FREE",
            },
            {
              label:
                "Paid",
              value:
                "PAID",
            },
            {
              label:
                "Enterprise",
              value:
                "ENTERPRISE",
            },
          ]}
        />

        <Select
          label="Billing Cycle"
          name="billingCycle"
          value={
            form.billingCycle
          }
          onChange={
            handleChange
          }
          options={[
            {
              label:
                "Monthly",
              value:
                "MONTHLY",
            },
            {
              label:
                "Quarterly",
              value:
                "QUARTERLY",
            },
            {
              label:
                "Half Yearly",
              value:
                "HALF_YEARLY",
            },
            {
              label:
                "Yearly",
              value:
                "YEARLY",
            },
            {
              label:
                "Lifetime",
              value:
                "LIFETIME",
            },
          ]}
        />

        <Input
          type="number"
          label="Price"
          name="price"
          value={String(
            form.price,
          )}
          onChange={
            handleChange
          }
          min={0}
        />
      </div>


      <div
        className={
          styles.form3
        }
      >
        <Input
          type="number"
          label="Trial Days"
          name="trialDays"
          value={String(
            form.trialDays,
          )}
          onChange={
            handleChange
          }
          min={0}
        />

        <Input
          type="number"
          label="Duration (Days)"
          name="durationInDays"
          value={
            form.durationInDays !==
            undefined
              ? String(
                  form.durationInDays,
                )
              : ""
          }
          onChange={
            handleChange
          }
          min={0}
        />

        <Select
          label="Status"
          name="status"
          value={
            form.status
          }
          onChange={
            handleChange
          }
          options={[
            {
              label:
                "Active",
              value:
                "ACTIVE",
            },
            {
              label:
                "Inactive",
              value:
                "INACTIVE",
            },
          ]}
        />
      </div>


      <h4
        className={
          styles.section
        }
      >
        Usage Limits
      </h4>


      <div
        className={
          styles.form3
        }
      >
        <Input
          type="number"
          label="Max Users"
          name="maxUsers"
          value={
            form.maxUsers !==
            undefined
              ? String(
                  form.maxUsers,
                )
              : ""
          }
          onChange={
            handleChange
          }
          min={0}
        />

        <Input
          type="number"
          label="Max Branches"
          name="maxBranches"
          value={
            form.maxBranches !==
            undefined
              ? String(
                  form.maxBranches,
                )
              : ""
          }
          onChange={
            handleChange
          }
          min={0}
        />

        <Input
          type="number"
          label="Max Projects"
          name="maxProjects"
          value={
            form.maxProjects !==
            undefined
              ? String(
                  form.maxProjects,
                )
              : ""
          }
          onChange={
            handleChange
          }
          min={0}
        />
      </div>


      <div
        className={
          styles.form2
        }
      >
        <Input
          type="number"
          label="Sort Order"
          name="sortOrder"
          value={String(
            form.sortOrder,
          )}
          onChange={
            handleChange
          }
          min={0}
        />

        <Checkbox
          label="Public Plan"
          name="isPublic"
          checked={
            form.isPublic
          }
          onChange={
            handleChange
          }
        />
      </div>


      <h4
        className={
          styles.section
        }
      >
        Modules Included (
        {form.moduleIds.length})
      </h4>


      <Input
        name="moduleSearch"
        placeholder="Search module by name or code..."
        value={
          moduleSearch
        }
        onChange={(
          event,
        ) =>
          setModuleSearch(
            event.target.value,
          )
        }
      />


      {modulesLoading ? (
        <div>
          Loading modules...
        </div>
      ) : filteredModules.length ===
        0 ? (
        <div>
          No active modules found.
        </div>
      ) : (
        <div
          className={
            styles.modulesGrid
          }
        >
          {filteredModules.map(
            (
              module:
                Module,
            ) => {
              const selected =
                form.moduleIds.includes(
                  module.id,
                );

              return (
                <div
                  key={
                    module.id
                  }
                  className={`${styles.moduleCard} ${
                    selected
                      ? styles.selected
                      : ""
                  }`}
                >
                  <Checkbox
                    label={`${module.name} (${module.code})`}
                    checked={
                      selected
                    }
                    onChange={() =>
                      handleModuleToggle(
                        module.id,
                      )
                    }
                  />
                </div>
              );
            },
          )}
        </div>
      )}
    </form>
  );
};


export default SubscriptionPlanForm;