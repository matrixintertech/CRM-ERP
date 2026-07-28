import { useEffect, useState } from "react";

import type {
  Module,
  ModuleFormData,
} from "../types/module.types";

import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";
import Select from "@/shared/components/Select";
import Checkbox from "@/shared/components/Checkbox";

import styles from "./ModuleForm.module.css";

interface Props {
  initialValues?: Partial<ModuleFormData>;

  onSubmit: (
    values: ModuleFormData,
  ) => void | Promise<void>;
}

const defaultValues: ModuleFormData = {
  name: "",

  code: "",

  description: "",

  icon: "",

  route: "",

  sortOrder: 1,

  isSystem: false,

  status: "ACTIVE",
};

const ModuleForm = ({
  initialValues,
  onSubmit,
}: Props) => {
  const [form, setForm] =
    useState<ModuleFormData>(
      defaultValues,
    );

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...defaultValues,
        ...initialValues,
      });
    } else {
      setForm(defaultValues);
    }
  }, [initialValues]);

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
          : name ===
              "sortOrder"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

      console.log("FORM SUBMIT");

    onSubmit(form);
  };

  return (
<form
  id="module-form"
  onSubmit={handleSubmit}
  className={styles.form}
>
  <div className={styles.row}>
    <Input
      id="name"
      label="Module Name"
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Inventory"
      required
    />

    <Input
      id="code"
      label="Code"
      name="code"
      value={form.code}
      onChange={handleChange}
      placeholder="INVENTORY"
      required
    />
  </div>

  <div className={styles.row}>
    <Input
      id="route"
      label="Route"
      name="route"
      value={form.route}
      onChange={handleChange}
      placeholder="/inventory"
    />

    <Input
      id="icon"
      label="Icon"
      name="icon"
      value={form.icon}
      onChange={handleChange}
      placeholder="Package"
    />
  </div>

  <div className={styles.row}>
    <Input
      id="sortOrder"
      label="Sort Order"
      type="number"
      name="sortOrder"
      value={String(form.sortOrder)}
      onChange={handleChange}
    />

    <Select
      id="status"
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

  <div className={styles.fullWidth}>
    <Textarea
      id="description"
      label="Description"
      name="description"
      value={form.description}
      onChange={handleChange}
      rows={4}
      placeholder="Enter module description"
    />
  </div>

  <div className={styles.checkboxRow}>
    <Checkbox
      id="isSystem"
      label="Is System Module"
      name="isSystem"
      checked={form.isSystem}
      onChange={handleChange}
    />
  </div>
 
</form>
  );
};

export default ModuleForm;