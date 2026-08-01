import { useEffect, useState } from "react";

import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";
import Select from "@/shared/components/Select";
import Checkbox from "@/shared/components/Checkbox";

import type {
  SubscriptionPlan,
  SubscriptionPlanFormData,
} from "../types/subscription-plan.types";

import { useModule } from "@/modules/module/hooks/useModules";

import type { Module } from "@/modules/module/types/module.types";

import styles from "./SubscriptionPlanForm.module.css";

interface Props {
  initialValues?: Partial<SubscriptionPlan>;

  onSubmit: (
    values: SubscriptionPlanFormData,
  ) => void | Promise<void>;
}

const defaultValues: SubscriptionPlanFormData = {
  name: "",

  code: "",

  description: "",

  planType: "PAID",

  billingCycle: "MONTHLY",

  price: 0,

  trialDays: 0,

  durationInDays: undefined,

  maxUsers: undefined,

  maxBranches: undefined,

  maxProjects: undefined,

  sortOrder: 1,

  isPublic: true,

  status: "ACTIVE",

  moduleIds: [],
};

const SubscriptionPlanForm = ({
  initialValues,
  onSubmit,
}: Props) => {
  const [form, setForm] =
    useState<SubscriptionPlanFormData>(
      defaultValues,
    );


 const {
  modules,
  fetchModules,
} = useModule();

const [moduleSearch, setModuleSearch] =
  useState("");

useEffect(() => {
  if (initialValues) {
    setForm({
      name: initialValues.name ?? "",
      code: initialValues.code ?? "",
      description: initialValues.description ?? "",

      planType: initialValues.planType ?? "PAID",
      billingCycle:
        initialValues.billingCycle ??
        "MONTHLY",

      price: Number(initialValues.price ?? 0),
      trialDays:
        initialValues.trialDays ?? 0,

      durationInDays:
        initialValues.durationInDays,

      maxUsers:
        initialValues.maxUsers,

      maxBranches:
        initialValues.maxBranches,

      maxProjects:
        initialValues.maxProjects,

      sortOrder:
        initialValues.sortOrder ?? 1,

      isPublic:
        initialValues.isPublic ?? true,

      status:
        initialValues.status ??
        "ACTIVE",

      moduleIds:
        initialValues.moduleIds ?? [],
    });
  } else {
    setForm(defaultValues);
  }
}, [initialValues]);

useEffect(() => {
  fetchModules();
}, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const {
      name,
      value,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? (
              e.target as HTMLInputElement
            ).checked
          : [
              "price",
              "trialDays",
              "durationInDays",
              "maxUsers",
              "maxBranches",
              "maxProjects",
              "sortOrder",
            ].includes(name)
          ? Number(value)
          : value,
    }));
  };


  const handleModuleToggle = (
  moduleId: string,
) => {
  setForm((prev) => ({
    ...prev,

    moduleIds: prev.moduleIds.includes(
      moduleId,
    )
      ? prev.moduleIds.filter(
          (id) => id !== moduleId,
        )
      : [
          ...prev.moduleIds,
          moduleId,
        ],
  }));
};


const filteredModules =
  modules.filter((module: Module) =>
    module.name
      .toLowerCase()
      .includes(
        moduleSearch.toLowerCase(),
      ),
  );

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    console.log(form.moduleIds);
console.log(typeof form.moduleIds[0]);

    onSubmit(form);
  };

  return (
    <form
  id="subscription-plan-form"
  onSubmit={handleSubmit}
  className={styles.form}
>
  {/* General Information */}

  <h4 className={styles.section}>
    General Information
  </h4>

  <div className={styles.form2}>
    <Input
      label="Plan Name"
      name="name"
      value={form.name}
      onChange={handleChange}
      required
    />

    <Input
      label="Plan Code"
      name="code"
      value={form.code}
      onChange={handleChange}
      required
    />

    <div className={styles.fullWidth}>
      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />
    </div>
  </div>

  {/* Pricing & Configuration */}

  <h4 className={styles.section}>
    Pricing & Configuration
  </h4>

  <div className={styles.form3}>
    <Select
  label="Plan Type"
  name="planType"
  value={form.planType}
  onChange={handleChange}
  options={[
    {
      label: "Internal",
      value: "INTERNAL",
    },
    {
      label: "Trial",
      value: "TRIAL",
    },
    {
      label: "Paid",
      value: "PAID",
    },
    {
      label: "Lifetime",
      value: "LIFETIME",
    },
  ]}
/>

    <Select
      label="Billing Cycle"
      name="billingCycle"
      value={form.billingCycle}
      onChange={handleChange}
      options={[
        {
          label: "Monthly",
          value: "MONTHLY",
        },
        {
          label: "Quarterly",
          value: "QUARTERLY",
        },
        {
          label: "Half Yearly",
          value: "HALF_YEARLY",
        },
        {
          label: "Yearly",
          value: "YEARLY",
        },
        {
          label: "Lifetime",
          value: "LIFETIME",
        },
      ]}
    />

    <Input
      type="number"
      label="Price"
      name="price"
      value={String(form.price)}
      onChange={handleChange}
    />
  </div>

  <div className={styles.form3}>
    <Input
      type="number"
      label="Trial Days"
      name="trialDays"
      value={String(form.trialDays)}
      onChange={handleChange}
    />

    <Input
      type="number"
      label="Duration (Days)"
      name="durationInDays"
      value={
        form.durationInDays
          ? String(form.durationInDays)
          : ""
      }
      onChange={handleChange}
    />

    <Select
      label="Status"
      name="status"
      value={form.status}
      onChange={handleChange}
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
    />
  </div>

  {/* Usage Limits */}

  <h4 className={styles.section}>
    Usage Limits
  </h4>

  <div className={styles.form3}>
    <Input
      type="number"
      label="Max Users"
      name="maxUsers"
      value={
        form.maxUsers
          ? String(form.maxUsers)
          : ""
      }
      onChange={handleChange}
    />

    <Input
      type="number"
      label="Max Branches"
      name="maxBranches"
      value={
        form.maxBranches
          ? String(form.maxBranches)
          : ""
      }
      onChange={handleChange}
    />

    <Input
      type="number"
      label="Max Projects"
      name="maxProjects"
      value={
        form.maxProjects
          ? String(form.maxProjects)
          : ""
      }
      onChange={handleChange}
    />
  </div>

  <div className={styles.form2}>
    <Input
      type="number"
      label="Sort Order"
      name="sortOrder"
      value={String(form.sortOrder)}
      onChange={handleChange}
    />

    <Checkbox
      label="Public Plan"
      name="isPublic"
      checked={form.isPublic}
      onChange={handleChange}
    />
  </div>

  {/* Modules */}

  <h4 className={styles.section}>
    Modules Included ({form.moduleIds.length})
  </h4>

  <Input
    placeholder="Search module..."
    value={moduleSearch}
    onChange={(e) =>
      setModuleSearch(e.target.value)
    }
  />

  <div className={styles.modulesGrid}>
    {filteredModules.map(
      (module: Module) => (
        <div
          key={module.id}
          className={`${styles.moduleCard} ${
            form.moduleIds.includes(
              module.id,
            )
              ? styles.selected
              : ""
          }`}
        >
          <Checkbox
            label={module.name}
            checked={form.moduleIds.includes(
              module.id,
            )}
            onChange={() =>
              handleModuleToggle(
                module.id,
              )
            }
          />
        </div>
      ),
    )}
  </div>
</form>
  );
};

export default SubscriptionPlanForm;