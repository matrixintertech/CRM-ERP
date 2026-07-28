import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import { useSubscriptionModules } from "../hooks/useSubscriptionModules";

const SubscriptionModulePage = () => {
  const { subscriptionPlanId } = useParams();

  const {
    loading,
    modules,
    selectedModules,

    fetchModules,
    toggleModule,
    saveModules,
  } = useSubscriptionModules();

  useEffect(() => {
  if (subscriptionPlanId) {
    fetchModules(subscriptionPlanId);
  }
}, [subscriptionPlanId]);

  return (
    <>
      <PageHeader
        title="Subscription Modules"
        subtitle="Assign modules to subscription plan"
      />

      <Card>
        {modules.length === 0 ? (
          <p>No modules found.</p>
        ) : (
          modules.map((module) => (
            <label
              key={module.id}
              style={{
                display: "block",
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selectedModules.includes(
                  module.id,
                )}
                onChange={() =>
                  toggleModule(
                    module.id,
                  )
                }
              />

              {" "}
              <strong>
                {module.name}
              </strong>

              <br />

              <small>
                {module.code}
              </small>
            </label>
          ))
        )}

        <Button
  loading={loading}
  onClick={() =>
    subscriptionPlanId &&
    saveModules(subscriptionPlanId)
  }
>
  Save Modules
</Button>
      </Card>
    </>
  );
};

export default SubscriptionModulePage;