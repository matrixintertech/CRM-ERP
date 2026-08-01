import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import DataTable from "@/shared/components/DataTable/DataTable";

import type {
  DataTableColumn,
} from "@/shared/components/DataTable/types";

import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

import DepartmentModal from "../components/DepartmentModal";

import { useDepartment } from "../hooks/useDepartment";
import { useOrganizationUnits } from "../../organization-unit/hooks/useOrganizationUnits";

import type {
  Department,
  DepartmentFormData,
} from "../types/department.types";

const createDefaultForm =
  (): DepartmentFormData => ({
    organizationUnitUuid: "",
    name: "",
    code: "",
    description: "",
  });

const DepartmentPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    departments,
    fetchDepartments,
    fetchDepartment,
    create,
    update,
    remove,
  } = useDepartment();

  const {
    organizationUnits,
    fetchOrganizationUnits,
  } = useOrganizationUnits();

  const [open, setOpen] =
    useState(false);

  const [editUuid, setEditUuid] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<DepartmentFormData>(
      createDefaultForm,
    );

  useEffect(() => {
    void fetchDepartments();
    void fetchOrganizationUnits();
  }, [
    fetchDepartments,
    fetchOrganizationUnits,
  ]);

  const resetForm = () => {
    setEditUuid(null);
    setFormData(
      createDefaultForm(),
    );
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
      const payload: DepartmentFormData = {
        organizationUnitUuid:
          formData.organizationUnitUuid,

        name:
          formData.name.trim(),

        code:
          formData.code
            .trim()
            .toUpperCase()
            .replace(/\s+/g, ""),

        description:
          formData.description?.trim() ||
          undefined,
      };

      if (editUuid) {
        await update(
          editUuid,
          payload,
        );
      } else {
        await create(payload);
      }

      await fetchDepartments();

      handleClose();
    } catch (error: any) {
      console.error(
        error?.response?.data ??
          error,
      );
    }
  };

  const handleEdit = async (
    uuid: string,
  ) => {
    try {
      const department =
        await fetchDepartment(
          uuid,
        );

      if (!department) {
        return;
      }

      setEditUuid(uuid);

      setFormData({
        organizationUnitUuid:
          department.organizationUnit
            ?.uuid ?? "",

        name:
          department.name,

        code:
          department.code,

        description:
          department.description ?? "",
      });

      setOpen(true);
    } catch (error: any) {
      console.error(
        error?.response?.data ??
          error,
      );
    }
  };

  const handleDelete = async (
    uuid: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this department?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await remove(uuid);
    } catch (error: any) {
      console.error(
        error?.response?.data ??
          error,
      );
    }
  };

  const columns:
    DataTableColumn<Department>[] = [
      {
        key: "organizationUnit",
        title: "Branch / Office",
        render: (row) =>
          row.organizationUnit
            ?.name ?? "-",
      },
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
        render: (row) =>
          row.description || "-",
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
            <Button
              size="sm"
              onClick={() =>
                navigate(
                  `/departments/${row.uuid}`,
                )
              }
            >
              <Eye size={16} />
            </Button>

            <Button
              size="sm"
              onClick={() =>
                handleEdit(
                  row.uuid,
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
              onClick={() =>
                handleDelete(
                  row.uuid,
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
        title="Department"
        subtitle="Manage organization unit departments"
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
              onClick={
                handleOpenCreate
              }
            >
              Add Department
            </Button>
          </div>
        }
      />

      <Card>
        <DataTable
          loading={loading}
          data={
            departments ?? []
          }
          columns={columns}
          keyField="uuid"
          showSerialNumber
          emptyMessage="No Departments Found."
        />
      </Card>

      <DepartmentModal
        title={
          editUuid
            ? "Edit Department"
            : "Create Department"
        }
        isEdit={
          Boolean(editUuid)
        }
        open={open}
        loading={loading}
        formData={formData}
        setFormData={
          setFormData
        }
        organizationUnits={
          organizationUnits
        }
        onClose={
          handleClose
        }
        onSubmit={
          handleSubmit
        }
      />
    </>
  );
};

export default DepartmentPage;