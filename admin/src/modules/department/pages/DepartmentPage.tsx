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

import DepartmentModal from "../components/DepartmentModal";
import { useDepartment } from "../hooks/useDepartment";

import type {
  Department,
  DepartmentFormData,
} from "../types/department.types";

const DepartmentPage = () => {
  const navigate = useNavigate();

  const defaultForm: DepartmentFormData = {
    name: "",
    code: "",
    description: "",
  };

  const {
    loading,
    departments,
    fetchDepartments,
    fetchDepartment,
    create,
    update,
  } = useDepartment();

  useEffect(() => {
    fetchDepartments();
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

        await fetchDepartments();

        setOpen(false);
        setEditId(null);
        setFormData(defaultForm);
      } catch (error: any) {
        console.error(
          error.response?.data ??
            error,
        );
      }
    };

  const handleEdit =
    async (id: string) => {
      const department =
        await fetchDepartment(id);

      if (!department) return;

      setEditId(id);

      setFormData({
        name: department.name,
        code: department.code,
        description:
          department.description ??
          "",
      });

      setOpen(true);
    };

  const columns: DataTableColumn<Department>[] =
    [
      {
        key: "name",
        title: "Department",
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
        title="Department"
        subtitle="Manage company departments"
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
              Add Department
            </Button>
          </div>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={departments ?? []}
          columns={columns}
          keyField="id"
          showSerialNumber
          emptyMessage="No Departments Found."
        />
      </Card>

      <DepartmentModal
        title={
          editId
            ? "Edit Department"
            : "Create Department"
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

export default DepartmentPage;