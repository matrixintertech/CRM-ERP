import Input from "@/shared/components/Input";

import styles from "./CompanyForm.module.css";

import type { CompanyFormData } from "../../types/company.types";

interface Props {
  formData: CompanyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<CompanyFormData>
  >;
}

const CompanyForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="Company Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <Input
        label="Company Code"
        value={formData.code}
        onChange={(e) =>
          setFormData({
            ...formData,
            code: e.target.value,
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

      <Input
        label="Logo URL"
        value={formData.logo}
        onChange={(e) =>
          setFormData({
            ...formData,
            logo: e.target.value,
          })
        }
      />
    </div>
  );
};

export default CompanyForm;