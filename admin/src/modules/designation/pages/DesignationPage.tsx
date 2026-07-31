import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import DataTable from "@/shared/components/DataTable/DataTable";

import type { DataTableColumn } from "@/shared/components/DataTable/types";

import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

import DesignationModal from "../components/DesignationModal";
import { useDesignation } from "../hooks/useDesignation";

import type {
  Designation,
  DesignationFormData,
} from "../types/designation.types";

const DesignationPage = () => {
  const navigate = useNavigate();

  const defaultForm: DesignationFormData = {
    name: "",
    code: "",
    description: "",
  };

  const {
    loading,
    designations,
    fetchDesignations,
    fetchDesignation,
    create,
    update,
  } = useDesignation();

  useEffect(() => {
    fetchDesignations();
  }, []);

  const [open, setOpen] =
    useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState(defaultForm);

  const handleSubmit =
    async () => {
      try {
        if (editId) {
          await update(
            editId,
            formData,
          );
        } else {
          await create(formData);
        }

        await fetchDesignations();

        setOpen(false);
        setEditId(null);
        setFormData(defaultForm);
      } catch (error: any) {
        console.error(
          error.response?.data ||
            error,
        );
      }
    };

  const handleEdit =
    async (id: string) => {
      const designation =
        await fetchDesignation(id);

      if (!designation) return;

      setEditId(id);

      setFormData({
        name: designation.name,
        code: designation.code,
        description:
          designation.description ??
          "",
      });

      setOpen(true);
    };

  const columns: DataTableColumn<Designation>[] =
    [
      {
        key: "name",
        title: "Designation",
      },
      {
        key: "code",
        title: "Code",
      },
      {
        key: "description",
        title: "Description",
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
              justifyContent:
                "center",
              gap: 8,
            }}
          >
            <Button size="sm">
              <Eye size={16} />
            </Button>

            <Button
              size="sm"
              onClick={() =>
                handleEdit(
                  String(row.id),
                )
              }
            >
              <SquarePen
                size={16}
              />
            </Button>

            <Button
              size="sm"
              variant="danger"
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
        title="Designation"
        subtitle="Manage employee designations"
        actions={
          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                navigate(-1)
              }
            >
              Back
            </Button>

            <Button
              onClick={() => {
                setEditId(null);
                setFormData(
                  defaultForm,
                );
                setOpen(true);
              }}
            >
              Add Designation
            </Button>
          </div>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={
            designations ?? []
          }
          columns={columns}
          keyField="id"
          showSerialNumber
          emptyMessage="No Designations Found."
        />
      </Card>

      <DesignationModal
        title={
          editId
            ? "Edit Designation"
            : "Create Designation"
        }
        isEdit={!!editId}
        open={open}
        loading={loading}
        formData={formData}
        setFormData={
          setFormData
        }
        onClose={() => {
          setOpen(false);
          setEditId(null);
          setFormData(
            defaultForm,
          );
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default DesignationPage;