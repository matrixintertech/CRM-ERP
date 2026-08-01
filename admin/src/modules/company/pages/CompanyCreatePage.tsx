import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import { notify } from "@/shared/utils/notify";

import { useSubscriptionPlans } from "../../subscription-plan/hooks/useSubscriptionPlans";

import {
  createCompanyOnboarding,
} from "../api/company.api";

import CompanyForm from "../components/forms/CompanyForm";
import SubscriptionForm from "../components/forms/SubscriptionForm";
import CompanyAdminForm from "../components/forms/CompanyAdminForm";
import ReviewForm from "../components/forms/ReviewForm";

import type {
  CompanyAdminFormData,
  CompanyFormData,
  SubscriptionFormData,
} from "../types/company.types";

import styles from "./CompanyCreatePage.module.css";

const TOTAL_STEPS = 4;

const steps = [
  "Company",
  "Subscription",
  "Admin",
  "Review",
];

const CompanyCreatePage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] =
    useState(false);

  const {
    subscriptionPlans,
    loading: plansLoading,
    loadSubscriptionPlans,
  } = useSubscriptionPlans();

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

  useEffect(() => {
    if (
      step === 2 &&
      subscriptionPlans.length === 0
    ) {
      void loadSubscriptionPlans();
    }
  }, [
    step,
    subscriptionPlans.length,
    loadSubscriptionPlans,
  ]);

  const isValidEmail = (
    value: string,
  ) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value,
    );

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!companyForm.name.trim()) {
        notify.error(
          "Company name is required.",
        );

        return false;
      }

      if (!companyForm.code.trim()) {
        notify.error(
          "Company code is required.",
        );

        return false;
      }

      if (!companyForm.email.trim()) {
        notify.error(
          "Company email is required.",
        );

        return false;
      }

      if (
        !isValidEmail(companyForm.email)
      ) {
        notify.error(
          "Enter a valid company email.",
        );

        return false;
      }

      if (!companyForm.mobile.trim()) {
        notify.error(
          "Company mobile is required.",
        );

        return false;
      }
    }

    if (step === 2) {
      if (
        subscriptionForm.subscriptionPlanId ===
        0
      ) {
        notify.error(
          "Please select a subscription plan.",
        );

        return false;
      }
    }

    if (step === 3) {
      if (!adminForm.displayName.trim()) {
        notify.error(
          "Admin display name is required.",
        );

        return false;
      }

      if (!adminForm.email.trim()) {
        notify.error(
          "Admin email is required.",
        );

        return false;
      }

      if (
        !isValidEmail(adminForm.email)
      ) {
        notify.error(
          "Enter a valid admin email.",
        );

        return false;
      }

      if (!adminForm.mobile.trim()) {
        notify.error(
          "Admin mobile is required.",
        );

        return false;
      }
    }

    return true;
  };

  const next = () => {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((previous) =>
      Math.min(
        previous + 1,
        TOTAL_STEPS,
      ),
    );
  };

  const previous = () => {
    setStep((previous) =>
      Math.max(previous - 1, 1),
    );
  };

  const handleBack = () => {
    const hasEnteredData = Boolean(
      companyForm.name ||
        companyForm.code ||
        companyForm.email ||
        companyForm.mobile ||
        companyForm.logo ||
        adminForm.displayName ||
        adminForm.email ||
        adminForm.mobile ||
        subscriptionForm.subscriptionPlanId >
          0,
    );

    if (
      hasEnteredData &&
      !window.confirm(
        "Your entered data will be lost. Continue?",
      )
    ) {
      return;
    }

    navigate("/companies");
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (
      subscriptionForm.subscriptionPlanId ===
      0
    ) {
      notify.error(
        "Please select a subscription plan.",
      );

      setStep(2);

      return;
    }

    try {
      setSubmitting(true);

      const response =
        await createCompanyOnboarding({
          company: {
            name: companyForm.name.trim(),

            code: companyForm.code
              .trim()
              .toUpperCase(),

            email: companyForm.email
              .trim()
              .toLowerCase(),

            mobile:
              companyForm.mobile.trim(),

            logo: companyForm.logo.trim(),
          },

          subscription:
            subscriptionForm,

          admin: {
            displayName:
              adminForm.displayName.trim(),

            email: adminForm.email
              .trim()
              .toLowerCase(),

            mobile:
              adminForm.mobile.trim(),
          },
        });

      notify.success(
        response?.message ??
          "Company created successfully.",
      );

      navigate("/companies");
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
            errors?: string[];
          };
        };
      };

      const backendErrors =
        apiError.response?.data?.errors;

      const message = Array.isArray(
        backendErrors,
      )
        ? backendErrors.join(", ")
        : apiError.response?.data
            ?.message ??
          "Failed to create company.";

      notify.error(message);

      console.error(
        "Company onboarding failed:",
        error,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Create Company"
        subtitle={`Step ${step} of ${TOTAL_STEPS}`}
        actions={
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={submitting}
          >
            Back
          </Button>
        }
      />

      <Card>
        <div className={styles.steps}>
          {steps.map(
            (label, index) => {
              const stepNumber =
                index + 1;

              const stepClassName = [
                styles.step,
                stepNumber === step
                  ? styles.activeStep
                  : "",
                stepNumber < step
                  ? styles.completedStep
                  : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={label}
                  className={
                    stepClassName
                  }
                >
                  <span
                    className={
                      styles.stepNumber
                    }
                  >
                    {stepNumber}
                  </span>

                  <span>{label}</span>
                </div>
              );
            },
          )}
        </div>

        <div
          className={styles.stepContent}
        >
          {step === 1 && (
            <CompanyForm
              formData={companyForm}
              setFormData={
                setCompanyForm
              }
            />
          )}

          {step === 2 && (
            <SubscriptionForm
              formData={
                subscriptionForm
              }
              setFormData={
                setSubscriptionForm
              }
              plans={
                subscriptionPlans
              }
              loading={plansLoading}
            />
          )}

          {step === 3 && (
            <CompanyAdminForm
              formData={adminForm}
              setFormData={
                setAdminForm
              }
            />
          )}

          {step === 4 && (
            <ReviewForm
              company={companyForm}
              subscription={
                subscriptionForm
              }
              admin={adminForm}
              plans={
                subscriptionPlans
              }
            />
          )}
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            disabled={
              step === 1 ||
              submitting
            }
            onClick={previous}
          >
            Previous
          </Button>

          {step < TOTAL_STEPS ? (
            <Button
              onClick={next}
              disabled={
                submitting ||
                (step === 2 &&
                  plansLoading)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting}
            >
              Create Company
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};

export default CompanyCreatePage;