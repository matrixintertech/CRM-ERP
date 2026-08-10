import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import Input from "@/shared/components/Input";

import type {
  CompanyProfile,
  UpdateCompanyProfile,
} from "../../types/company-profile.types";

import styles from "./CompanyProfileForm.module.css";

interface Props {
  company: CompanyProfile | null;
  saving: boolean;

  onSubmit: (
    data: UpdateCompanyProfile,
  ) => Promise<CompanyProfile>;
}

const CompanyProfileForm = ({
  company,
  saving,
  onSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCompanyProfile>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
    },
  });

  useEffect(() => {
    if (!company) {
      return;
    }

    reset({
      name: company.name,
      email: company.email ?? "",
      mobile: company.mobile ?? "",
    });
  }, [company, reset]);

  if (!company) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title="Basic Information"
        className="mb-4"
      >
        <div className={styles.form}>
          <Input
            label="Company Name"
            error={errors.name?.message}
            {...register("name", {
              required:
                "Company name is required",
            })}
          />

          <Input
            label="Company Code"
            value={company.code}
            disabled
          />

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Mobile"
            error={errors.mobile?.message}
            {...register("mobile")}
          />

          <Input
            label="Status"
            value={company.status}
            disabled
          />
        </div>
      </Card>

      <Card
        title="Registration Details"
        className="mb-4"
      >
        <div className={styles.form}>
          <Input
            label="GST Number"
            value=""
            disabled
          />

          <Input
            label="PAN Number"
            value=""
            disabled
          />

          <Input
            label="Website"
            value=""
            disabled
          />

          <Input
            label="Logo"
            value={company.logo ?? ""}
            disabled
          />
        </div>
      </Card>

      <Card
        title="Address Information"
        className="mb-4"
      >
        <div className={styles.form}>
          <Input
            label="Address"
            value=""
            disabled
          />

          <Input
            label="State"
            value=""
            disabled
          />

          <Input
            label="City"
            value=""
            disabled
          />

          <Input
            label="Pincode"
            value=""
            disabled
          />
        </div>
      </Card>

      <Card
        title="System Information"
        footer={
          <Button
            type="submit"
            loading={saving}
          >
            Save Changes
          </Button>
        }
      >
        <div className={styles.form}>
          <Input
            label="Created At"
            value={
              new Date(
                company.createdAt,
              ).toLocaleString("en-IN")
            }
            disabled
          />

          <Input
            label="Updated At"
            value={
              company.updatedAt
                ? new Date(
                    company.updatedAt,
                  ).toLocaleString("en-IN")
                : "-"
            }
            disabled
          />
        </div>
      </Card>
    </form>
  );
};

export default CompanyProfileForm;