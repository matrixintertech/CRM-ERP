import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import Checkbox from "@/shared/components/Checkbox";
import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";
import Textarea from "@/shared/components/Textarea";

import type {
  Module,
  ModuleFormData,
} from "../types/module.types";

import styles from "./ModuleForm.module.css";

interface Props {
  initialValues?: Partial<ModuleFormData>;
  editingModuleUuid?: string;
  modules: Module[];
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
  parentId: "",
  sortOrder: 1,
  isMenu: true,
  isVisible: true,
  isSystem: false,
  status: "ACTIVE",
};

const ModuleForm = ({
  initialValues,
  editingModuleUuid,
  modules,
  onSubmit,
}: Props) => {
  const [form, setForm] =
    useState<ModuleFormData>(
      () => ({ ...defaultValues }),
    );

  useEffect(() => {
    setForm({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues]);

  const handleChange = (
    e: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    let nextValue:
      | string
      | number
      | boolean = value;

    if (type === "checkbox") {
      nextValue = (
        e.target as HTMLInputElement
      ).checked;
    } else if (name === "sortOrder") {
      nextValue = Math.max(
        1,
        Number(value) || 1,
      );
    }

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    await onSubmit(form);
  };

  const parentOptions = [
    {
      label: "None",
      value: "",
    },
    ...modules
      .filter(
        (module) =>
          !module.parent &&
          module.uuid !==
            editingModuleUuid,
      )
      .map((module) => ({
        label: module.name,
        value: module.uuid,
      })),
  ];

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
         <Select
            id="parentId"
            label="Parent Module"
            name="parentId"
            value={form.parentId ?? ""}
            onChange={handleChange}
            showPlaceholder={false}
            options={parentOptions}
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
          min={1}
        />

        <Select
          id="status"
          label="Status"
          name="status"
          value={form.status ?? "ACTIVE"}
          onChange={handleChange}
          showPlaceholder={false}
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
          id="isMenu"
          label="Show In Menu"
          name="isMenu"
          checked={form.isMenu}
          onChange={handleChange}
        />

        <Checkbox
          id="isVisible"
          label="Visible"
          name="isVisible"
          checked={form.isVisible}
          onChange={handleChange}
        />

        <Checkbox
          id="isSystem"
          label="System Module"
          name="isSystem"
          checked={form.isSystem}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default ModuleForm;