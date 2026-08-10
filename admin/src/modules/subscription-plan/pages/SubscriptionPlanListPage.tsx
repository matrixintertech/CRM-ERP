import { useState } from "react";

import {
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import DataTable from "@/shared/components/DataTable/DataTable";
import Modal from "@/shared/components/Modal";
import PageHeader from "@/shared/components/PageHeader";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import SubscriptionPlanDetailsModal from "../components/SubscriptionPlanDetailsModal";
import SubscriptionPlanForm from "../components/SubscriptionPlanForm";

import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";

import type {
  SubscriptionPlan,
  SubscriptionPlanFormData,
} from "../types/subscription-plan.types";

const SubscriptionPlanListPage = () => {
  useDocumentTitle("Subscription Plans");

  const {
    loading,
    subscriptionPlans,
    addSubscriptionPlan,
    editSubscriptionPlan,
    removeSubscriptionPlan,
    fetchSubscriptionPlan,
    saving,
    deleting,
  } = useSubscriptionPlans();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    selectedPlanDetails,
    setSelectedPlanDetails,
  ] = useState<SubscriptionPlan | null>(
    null,
  );

  const [
    editingPlan,
    setEditingPlan,
  ] = useState<SubscriptionPlan | null>(
    null,
  );

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    selectedPlan,
    setSelectedPlan,
  ] = useState<SubscriptionPlan | null>(
    null,
  );

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingPlan(null);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedPlanDetails(null);
  };

  const handleOpenDelete = (
    plan: SubscriptionPlan,
  ) => {
    setSelectedPlan(plan);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedPlan(null);
  };

  const handleEdit = async (
    id: string,
  ) => {
    try {
      const plan =
        await fetchSubscriptionPlan(
          id,
        );

      setEditingPlan(plan);

      setOpen(true);
    } catch (error) {
      console.error(
        "Failed to load subscription plan:",
        error,
      );
    }
  };

  const handleView = async (
    id: string,
  ) => {
    try {
      const plan =
        await fetchSubscriptionPlan(
          id,
        );

      setSelectedPlanDetails(
        plan,
      );

      setDetailsOpen(true);
    } catch (error) {
      console.error(
        "Failed to load subscription plan details:",
        error,
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) {
      return;
    }

    try {
      await removeSubscriptionPlan(
        selectedPlan.id,
      );

      handleCloseDelete();
    } catch (error) {
      console.error(
        "Failed to delete subscription plan:",
        error,
      );
    }
  };

  const handleSubmit = async (
    values: SubscriptionPlanFormData,
  ) => {
    try {
      if (editingPlan) {
        await editSubscriptionPlan(
          editingPlan.id,
          values,
        );
      } else {
        await addSubscriptionPlan(
          values,
        );
      }

      handleCloseModal();
    } catch (error) {
      console.error(
        "Failed to save subscription plan:",
        error,
      );
    }
  };

  const columns:
    DataTableColumn<SubscriptionPlan>[] = [
      {
        key: "name",
        title: "Plan",
        render: (row) => (
          <button
            type="button"
            onClick={() =>
              handleView(row.id)
            }
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
              justifyContent:
                "center",
              gap: 8,
            }}
          >
            <Button
              size="sm"
              aria-label={`Edit ${row.name}`}
              onClick={() =>
                handleEdit(row.id)
              }
            >
              <SquarePen
                size={16}
              />
            </Button>

            <Button
              size="sm"
              variant="danger"
              aria-label={`Delete ${row.name}`}
              onClick={() =>
                handleOpenDelete(
                  row,
                )
              }
            >
              <Trash2
                size={16}
              />
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
            onClick={
              handleOpenCreate
            }
          >
            <Plus size={18} />
            Create Plan
          </Button>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={
            subscriptionPlans
          }
          columns={columns}
          keyField="id"
          showSerialNumber
          emptyMessage="No subscription plans found."
        />
      </Card>

      <Modal
        open={open}
        title={
          editingPlan
            ? "Edit Subscription Plan"
            : "Create Subscription Plan"
        }
        size="lg"
        onClose={
          handleCloseModal
        }
        footer={
          <>
            <Button
              variant="secondary"
              disabled={saving}
              onClick={
                handleCloseModal
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="subscription-plan-form"
              loading={saving}
            >
              {editingPlan
                ? "Update Plan"
                : "Save Plan"}
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
          onSubmit={
            handleSubmit
          }
        />
      </Modal>

      <SubscriptionPlanDetailsModal
        open={detailsOpen}
        plan={
          selectedPlanDetails
        }
        onClose={
          handleCloseDetails
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Subscription Plan"
        message={
          selectedPlan
            ? `Are you sure you want to delete "${selectedPlan.name}"?`
            : "Are you sure you want to delete this subscription plan?"
        }
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={
          handleDelete
        }
        onClose={
          handleCloseDelete
        }
      />
    </>
  );
};

export default SubscriptionPlanListPage;