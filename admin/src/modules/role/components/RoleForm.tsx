import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea/Textarea";


import type { RoleFormData } from "../types/role.types";

import styles from "./RoleForm.module.css";

interface Props {
  formData: RoleFormData;

  setFormData: React.Dispatch<
    React.SetStateAction<RoleFormData>
  >;
}

const RoleForm = ({
  formData,
  setFormData,
}: Props) => {
  return (
    <div className={styles.form}>
      <Input
        label="Role Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <Input
        label="Role Code"
        value={formData.code}
        onChange={(e) =>
          setFormData({
            ...formData,
            code: e.target.value
              .toUpperCase()
              .replace(/\s+/g, "_"),
          })
        }
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description:
              e.target.value,
          })
        }
        rows={4}
      />
    </div>
  );
};

export default RoleForm;