import { useEffect, useState } from "react";


import { Plus, SquarePen, Trash2 } from "lucide-react";


import Modal from "@/shared/components/Modal";

import PageHeader from "@/shared/components/PageHeader";
import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import DataTable from "@/shared/components/DataTable/DataTable";

import { useModules } from "../hooks/useModules";

import type {
  Module,
  ModuleFormData,
} from "../types/module.types";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import ModuleForm from "../components/ModuleForm";
import ConfirmDialog from "@/shared/components/ConfirmDialog";

const ModuleListPage = () => {
  const {
  loading,
  modules,
  loadModules,
  addModule,
  editModule,
   removeModule
} = useModules();

  const [open, setOpen] =
  useState(false);

const [editingModule, setEditingModule] =
  useState<Module | null>(null);


  const [deleteOpen, setDeleteOpen] =
  useState(false);

const [selectedModule, setSelectedModule] =
  useState<Module | null>(null);

  useEffect(() => {
    loadModules();
  }, []);


  const handleSubmit = async (
  values: ModuleFormData,
) => {

  try {

    if (editingModule) {
      await editModule(
        editingModule.id,
        values,
      );
    } else {
      await addModule(values);
    }

    await loadModules();

    setOpen(false);

    setEditingModule(null);
  } catch (error) {
    console.error(error);
  }
};


const handleDelete = async () => {
  if (!selectedModule) return;

  try {
    await removeModule(
      selectedModule.id,
    );

    setDeleteOpen(false);

    setSelectedModule(null);

    await loadModules();
  } catch (error) {
    console.error(error);
  }
};

  const columns: DataTableColumn<Module>[] = [
    {
      key: "name",
      title: "Module",
    },
    {
      key: "code",
      title: "Code",
    },
    {
      key: "route",
      title: "Route",
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span>{row.status}</span>
      ),
    },
    {
      key: "isSystem",
      title: "System",
      align: "center",
      render: (row) => (
        row.isSystem ? "Yes" : "No"
      ),
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
  onClick={() => {
    setEditingModule(row);

    setOpen(true);
  }}
>
  <SquarePen size={16} />
</Button>

         <Button
  size="sm"
  variant="danger"
  onClick={() => {
    setSelectedModule(row);
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
        title="Module Master"
        subtitle="Manage application modules"
        actions={
          <Button
  onClick={() => {
    setEditingModule(null);
    setOpen(true);
  }}
>
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
  title={
    editingModule
      ? "Edit Module"
      : "Create Module"
  }
  onClose={() => {
    setOpen(false);
    setEditingModule(null);
  }}
  footer={
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setOpen(false);
          setEditingModule(null);
        }}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        form="module-form"
        loading={loading}
      >
        {editingModule
          ? "Update Module"
          : "Save Module"}
      </Button>
    </>
  }
>
 <ModuleForm
  initialValues={
    editingModule
      ? {
          name: editingModule.name,
          code: editingModule.code,
          description: editingModule.description,
          icon: editingModule.icon,
          route: editingModule.route,
          sortOrder: editingModule.sortOrder,
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
  message={`Are you sure you want to delete "${selectedModule?.name}"?`}
  confirmText="Delete"
  confirmVariant="danger"
  loading={loading}
  onConfirm={handleDelete}
  onClose={() => {
    setDeleteOpen(false);
    setSelectedModule(null);
  }}
/>


    </>
  );
};

export default ModuleListPage;