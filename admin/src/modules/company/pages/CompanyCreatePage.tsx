import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createCompanyOnboarding,
} from "../api/company.api";

import type {
  CompanyFormData,
  SubscriptionFormData,
  CompanyAdminFormData,
} from "../types/company.types";


import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import CompanyForm from "../components/forms/CompanyForm";
import SubscriptionForm from "../components/forms/SubscriptionForm";
import CompanyAdminForm from "../components/forms/CompanyAdminForm";
import ReviewForm from "../components/forms/ReviewForm";

const CompanyCreatePage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);


  const [companyForm, setCompanyForm] =
  useState<CompanyFormData>({
    name: "",
    code: "",
    email: "",
    mobile: "",
    logo: "",
  });

const [
  subscriptionForm,
  setSubscriptionForm,
] = useState<SubscriptionFormData>({
  subscriptionPlanId: 0,
});

const [adminForm, setAdminForm] =
  useState<CompanyAdminFormData>({
    displayName: "",
    email: "",
    mobile: "",
  });


  const handleSubmit = async () => {
  try {
    const response =
      await createCompanyOnboarding({
        company: companyForm,
        subscription: subscriptionForm,
        admin: adminForm,
      });

    console.log(response);

    navigate("/companies");
  } catch (error: any) {
    console.log(
      "Backend Error:",
      error.response?.data,
    );

    console.log(
      "Request Payload:",
      {
        company: companyForm,
        subscription:
          subscriptionForm,
        admin: adminForm,
      },
    );
  }
};



  const next = () =>
    setStep((prev) => prev + 1);

  const previous = () =>
    setStep((prev) => prev - 1);

  return (
    <>
      <PageHeader
        title="Create Company"
        subtitle="Create a new company"
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              navigate("/companies")
            }
          >
            Back
          </Button>
        }
      />

      <Card>
        {step === 1 && (
        <CompanyForm
          formData={companyForm}
          setFormData={setCompanyForm}
        />
      )}

      {step === 2 && (
        <SubscriptionForm
          formData={subscriptionForm}
          setFormData={
            setSubscriptionForm
          }
        />
      )}

      {step === 3 && (
        <CompanyAdminForm
          formData={adminForm}
          setFormData={setAdminForm}
        />
      )}

            {step === 4 && (
        <ReviewForm
          company={companyForm}
          subscription={subscriptionForm}
          admin={adminForm}
        />
      )}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginTop: "24px",
          }}
        >
          <Button
            variant="secondary"
            disabled={step === 1}
            onClick={previous}
          >
            Previous
          </Button>

          {step < 4 ? (
            <Button
              onClick={next}
            >
              Next
            </Button>
          ) : (
           <Button onClick={handleSubmit}>
            Create Company
          </Button>
          )}
        </div>
      </Card>
    </>
  );
};

export default CompanyCreatePage;