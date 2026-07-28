import Input from "@/shared/components/Input";

import styles from "./CompanyAdminForm.module.css";

import type {
  CompanyAdminFormData,
} from "../../types/company.types";

interface Props {
  formData: CompanyAdminFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<CompanyAdminFormData>
  >;
}

const CompanyAdminForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="Display Name"
        value={formData.displayName}
        onChange={(e) =>
          setFormData({
            ...formData,
            displayName:
              e.target.value,
          })
        }
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value,
          })
        }
      />

      <Input
        label="Mobile"
        value={formData.mobile}
        onChange={(e) =>
          setFormData({
            ...formData,
            mobile: e.target.value,
          })
        }
      />
    </div>
  );
};

export default CompanyAdminForm;