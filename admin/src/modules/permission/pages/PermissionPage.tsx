import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { SquarePen, Trash2 } from "lucide-react";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import DataTable from "@/shared/components/DataTable/DataTable";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import PermissionModal from "../components/PermissionModal";

import { usePermission } from "../hooks/usePermission";

import type { Permission, PermissionFormData } from "../types/permission.types";

const createDefaultForm = (): PermissionFormData => ({
  module: "DASHBOARD",

  name: "",
  code: "",

  description: "",

  status: "ACTIVE",
});

const PermissionPage = () => {
  const navigate = useNavigate();

  useDocumentTitle("All Permissions");

  const {
    loading,
    permissions,
    fetchPermissions,
    fetchPermission,
    create,
    update,
    remove,
  } = usePermission();

  const [open, setOpen] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] =
    useState<PermissionFormData>(createDefaultForm);

  useEffect(() => {
    void fetchPermissions();
  }, [fetchPermissions]);

  const resetForm = () => {
    setEditId(null);

    setFormData(createDefaultForm());
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    try {
      const payload: PermissionFormData = {
        module: formData.module,

        name: formData.name.trim(),

        code: formData.code.trim().toLowerCase(),

        description: formData.description?.trim() || undefined,

        status: formData.status ?? "ACTIVE",
      };

      if (editId) {
        await update(editId, payload);
      } else {
        await create(payload);
      }

      await fetchPermissions();

      handleClose();
    } catch (error: any) {
      console.error(error?.response?.data ?? error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const permission = await fetchPermission(id);

      if (!permission) {
        return;
      }

      setEditId(id);

      setFormData({
        module: permission.module,

        name: permission.name,

        code: permission.code,

        description: permission.description ?? "",

        status: permission.status,
      });

      setOpen(true);
    } catch (error: any) {
      console.error(error?.response?.data ?? error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this permission?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await remove(id);
    } catch (error: any) {
      console.error(error?.response?.data ?? error);
    }
  };

  const columns: DataTableColumn<Permission>[] = [
    {
      key: "module",
      title: "Module",

      render: (row) =>
        row.module
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (character) => character.toUpperCase()),
    },
    {
      key: "name",
      title: "Permission",
    },
    {
      key: "code",
      title: "Code",
    },
    {
      key: "description",
      title: "Description",

      render: (row) => row.description || "-",
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
          <Button size="sm" onClick={() => handleEdit(String(row.id))}>
            <SquarePen size={16} />
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(String(row.id))}
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
        title="Permissions"
        subtitle="Manage global system permissions"
        actions={
          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>

            <Button onClick={handleOpenCreate}>Add Permission</Button>
          </div>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={permissions ?? []}
          columns={columns}
          keyField="id"
          showSerialNumber
          emptyMessage="No Permissions Found."
        />
      </Card>

      <PermissionModal
        title={editId ? "Edit Permission" : "Create Permission"}
        isEdit={Boolean(editId)}
        open={open}
        loading={loading}
        formData={formData}
        setFormData={setFormData}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PermissionPage;
