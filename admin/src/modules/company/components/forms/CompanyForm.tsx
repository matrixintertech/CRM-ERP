import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";

import Input from "@/shared/components/Input";

import type {
  CompanyFormData,
} from "../../types/company.types";

import styles from "./CompanyForm.module.css";

interface Props {
  formData: CompanyFormData;

  setFormData: Dispatch<
    SetStateAction<CompanyFormData>
  >;
}

const CompanyForm = ({
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
        id="company-name"
        label="Company Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Matrixs IT"
        required
      />

      <Input
        id="company-code"
        label="Company Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        placeholder="MATRIXS"
        required
      />

      <Input
        id="company-email"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="admin@example.com"
        required
      />

      <Input
        id="company-mobile"
        label="Mobile"
        type="tel"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="+91 9876543210"
        required
      />

      <Input
        id="company-logo"
        label="Logo URL"
        type="url"
        name="logo"
        value={formData.logo}
        onChange={handleChange}
        placeholder="https://example.com/logo.png"
      />
    </div>
  );
};

export default CompanyForm;