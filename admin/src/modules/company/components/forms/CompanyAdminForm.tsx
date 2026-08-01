import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";

import type {
  CompanyAdminFormData,
} from "../../types/company.types";

import styles from "./CompanyAdminForm.module.css";

interface Props {
  formData: CompanyAdminFormData;

  setFormData: Dispatch<
    SetStateAction<CompanyAdminFormData>
  >;
}

const CompanyAdminForm = ({
  formData,
  setFormData,
}: Props) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <div className={styles.form}>
      <Input
        id="display-name"
        label="Display Name"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />

      <Input
        id="admin-email"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="admin@example.com"
        required
      />

      <Input
        id="admin-mobile"
        label="Mobile"
        type="tel"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="+91 9876543210"
        required
      />
    </div>
  );
};

export default CompanyAdminForm;