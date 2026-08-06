import { useEffect, useMemo, useState } from "react";
import { Plus, SquarePen, Trash2 } from "lucide-react";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import DataTable from "@/shared/components/DataTable/DataTable";
import Modal from "@/shared/components/Modal";
import PageHeader from "@/shared/components/PageHeader";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import ModuleForm from "../components/ModuleForm";
import { useModule } from "../hooks/useModules";

import type { Module, ModuleFormData } from "../types/module.types";

const ModuleListPage = () => {
  useDocumentTitle("Module Master");
  const { loading, modules, fetchModules, create, update, remove } =
    useModule();

  const [open, setOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    void fetchModules();
  }, [fetchModules]);

  const handleOpenCreate = () => {
    setEditingModule(null);
    setOpen(true);
  };

  const handleOpenEdit = (module: Module) => {
    setEditingModule(module);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingModule(null);
  };

  const handleOpenDelete = (module: Module) => {
    setSelectedModule(module);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedModule(null);
  };

  const handleSubmit = async (values: ModuleFormData) => {
    try {
      const payload: ModuleFormData = {
        ...values,
        parentId: values.parentId || undefined,
        status: values.status || "ACTIVE",
      };

      if (editingModule) {
        await update(editingModule.id, payload);
      } else {
        await create(payload);
      }

      await fetchModules();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save module:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedModule) {
      return;
    }

    try {
      await remove(selectedModule.id);
      await fetchModules();
      handleCloseDelete();
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
  };

  const columns = useMemo<DataTableColumn<Module>[]>(
    () => [
      {
        key: "name",
        title: "Module",
      },
      {
        key: "code",
        title: "Code",
      },
      {
        key: "parent",
        title: "Parent",
        render: (row) => row.parent?.name ?? "-",
      },
      {
        key: "route",
        title: "Route",
        render: (row) => row.route || "-",
      },
      {
        key: "isMenu",
        title: "Menu",
        align: "center",
        render: (row) => (row.isMenu ? "Yes" : "No"),
      },
      {
        key: "isVisible",
        title: "Visible",
        align: "center",
        render: (row) => (row.isVisible ? "Yes" : "No"),
      },
      {
        key: "isSystem",
        title: "System",
        align: "center",
        render: (row) => (row.isSystem ? "Yes" : "No"),
      },
      {
        key: "status",
        title: "Status",
        align: "center",
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
            <Button
              size="sm"
              aria-label={`Edit ${row.name}`}
              onClick={() => handleOpenEdit(row)}
            >
              <SquarePen size={16} />
            </Button>

            <Button
              size="sm"
              variant="danger"
              disabled={row.isSystem}
              aria-label={`Delete ${row.name}`}
              onClick={() => handleOpenDelete(row)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const parentModules = useMemo(
    () => modules.filter((module) => module.id !== editingModule?.id),
    [modules, editingModule],
  );

  return (
    <>
      <PageHeader
        title="Module Master"
        subtitle="Manage application modules"
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus size={18} />
            Add Module
          </Button>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={modules}
          columns={columns}
          keyField="id"
          emptyMessage="No modules found."
          showSerialNumber
        />
      </Card>

      <Modal
        open={open}
        title={editingModule ? "Edit Module" : "Create Module"}
        onClose={handleCloseModal}
        footer={
          <>
            <Button
              variant="secondary"
              disabled={loading}
              onClick={handleCloseModal}
            >
              Cancel
            </Button>

            <Button type="submit" form="module-form" loading={loading}>
              {editingModule ? "Update Module" : "Save Module"}
            </Button>
          </>
        }
      >
        <ModuleForm
          modules={parentModules}
          initialValues={
            editingModule
              ? {
                  name: editingModule.name,
                  code: editingModule.code,
                  description: editingModule.description ?? "",
                  icon: editingModule.icon ?? "",
                  route: editingModule.route ?? "",
                  parentId: editingModule.parent?.uuid ?? "",
                  sortOrder: editingModule.sortOrder,
                  isMenu: editingModule.isMenu,
                  isVisible: editingModule.isVisible,
                  isSystem: editingModule.isSystem,
                  status: editingModule.status,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Module"
        message={
          selectedModule
            ? `Are you sure you want to delete "${selectedModule.name}"?`
            : "Are you sure you want to delete this module?"
        }
        confirmText="Delete"
        confirmVariant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onClose={handleCloseDelete}
      />
    </>
  );
};

export default ModuleListPage;
