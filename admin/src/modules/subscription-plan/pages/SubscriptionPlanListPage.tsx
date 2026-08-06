import { useEffect, useState } from "react";

import { Plus, SquarePen, Trash2 } from "lucide-react";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import DataTable from "@/shared/components/DataTable/DataTable";
import Modal from "@/shared/components/Modal";
import ConfirmDialog from "@/shared/components/ConfirmDialog";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";

import SubscriptionPlanForm from "../components/SubscriptionPlanForm";

import SubscriptionPlanDetailsModal from "../components/SubscriptionPlanDetailsModal";

import type { SubscriptionPlanFormData } from "../types/subscription-plan.types";

import type { SubscriptionPlan } from "../types/subscription-plan.types";

const SubscriptionPlanListPage = () => {
  useDocumentTitle("Subscription Plans");
  const {
    loading,
    subscriptionPlans,
    loadSubscriptionPlans,
    addSubscriptionPlan,
    editSubscriptionPlan,
    removeSubscriptionPlan,
    fetchSubscriptionPlan,
  } = useSubscriptionPlans();

  const [open, setOpen] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedPlanDetails, setSelectedPlanDetails] =
    useState<SubscriptionPlan | null>(null);

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );

  useEffect(() => {
    loadSubscriptionPlans();
  }, []);

  const handleEdit = async (id: string) => {
    try {
      const plan = await fetchSubscriptionPlan(id);

      setEditingPlan(plan);

      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = async (id: string) => {
    try {
      const plan = await fetchSubscriptionPlan(id);

      setSelectedPlanDetails(plan);

      setDetailsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;

    try {
      await removeSubscriptionPlan(selectedPlan.id);

      setDeleteOpen(false);

      setSelectedPlan(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values: SubscriptionPlanFormData) => {
    try {
      if (editingPlan) {
        await editSubscriptionPlan(editingPlan.id, values);
      } else {
        await addSubscriptionPlan(values);
      }

      await loadSubscriptionPlans();

      setOpen(false);

      setEditingPlan(null);
    } catch (error) {
      console.error(error);
    }
  };

  const columns: DataTableColumn<SubscriptionPlan>[] = [
    {
      key: "name",
      title: "Plan",
      render: (row) => (
        <button
          type="button"
          onClick={() => handleView(row.id)}
          style={{
            border: "none",
            background: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: 600,
            padding: 0,
          }}
        >
          {row.name}
        </button>
      ),
    },
    {
      key: "code",
      title: "Code",
    },
    {
      key: "planType",
      title: "Type",
    },
    {
      key: "price",
      title: "Price",
    },
    {
      key: "billingCycle",
      title: "Billing",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
      render: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Button size="sm" onClick={() => handleEdit(row.id)}>
            <SquarePen size={16} />
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedPlan(row);

              setDeleteOpen(true);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Subscription Plans"
        subtitle="Manage subscription plans and included modules"
        actions={
          <Button
            onClick={() => {
              setEditingPlan(null);

              setOpen(true);
            }}
          >
            <Plus size={18} />
            Create Plan
          </Button>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={subscriptionPlans}
          columns={columns}
          keyField="id"
          showSerialNumber
          emptyMessage="No subscription plans found."
        />
      </Card>

      <Modal
        open={open}
        title={
          editingPlan ? "Edit Subscription Plan" : "Create Subscription Plan"
        }
        size="lg"
        onClose={() => {
          setOpen(false);
          setEditingPlan(null);
        }}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setOpen(false);
                setEditingPlan(null);
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="subscription-plan-form"
              loading={loading}
            >
              {editingPlan ? "Update Plan" : "Save Plan"}
            </Button>
          </>
        }
      >
        <SubscriptionPlanForm
          initialValues={
            editingPlan
              ? {
                  ...editingPlan,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      </Modal>

      <SubscriptionPlanDetailsModal
        open={detailsOpen}
        plan={selectedPlanDetails}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPlanDetails(null);
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Subscription Plan"
        message={`Are you sure you want to delete "${selectedPlan?.name}"?`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onClose={() => {
          setDeleteOpen(false);

          setSelectedPlan(null);
        }}
      />
    </>
  );
};

export default SubscriptionPlanListPage;
