import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

import PageHeader from "@/shared/components/PageHeader";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import DataTable from "@/shared/components/DataTable/DataTable";

import type {
  DataTableColumn,
} from "@/shared/components/DataTable/types";

import DesignationModal from "../components/DesignationModal";

import {
  useDesignation,
} from "../hooks/useDesignation";

import {
  useDepartment,
} from "../../department/hooks/useDepartment";

import type {
  DesignationFormData,
} from "../types/designation.types";

const createDefaultForm =
  (): DesignationFormData => ({
    departmentUuid: "",
    name: "",
    code: "",
    description: "",
  });

const DesignationPage = () => {
  const navigate =
    useNavigate();

  const {
    loading,
    designations,

    fetchDesignation,

    create,
    update,
    remove,

    saving,
  } = useDesignation();

  const {
    departments,
    loading:
      loadingDepartments,
  } = useDepartment();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    editUuid,
    setEditUuid,
  ] = useState<
    string | null
  >(null);

  const [
    formData,
    setFormData,
  ] =
    useState<DesignationFormData>(
      createDefaultForm,
    );

  const resetForm = () => {
    setEditUuid(
      null,
    );

    setFormData(
      createDefaultForm(),
    );
  };

  const handleOpenCreate =
    () => {
      resetForm();

      setOpen(
        true,
      );
    };

  const handleClose =
    () => {
      setOpen(
        false,
      );

      resetForm();
    };

  const handleSubmit =
    async () => {
      try {
        const payload:
          DesignationFormData = {
          departmentUuid:
            formData.departmentUuid,

          name:
            formData.name.trim(),

          code:
            formData.code
              .trim()
              .toUpperCase()
              .replace(
                /\s+/g,
                "",
              ),

          description:
            formData.description
              ?.trim() ||
            undefined,
        };

        if (editUuid) {
          await update(
            editUuid,
            payload,
          );
        } else {
          await create(
            payload,
          );
        }

        handleClose();
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };

  const handleEdit =
    async (
      uuid: string,
    ) => {
      try {
        const designation =
          await fetchDesignation(
            uuid,
          );

        if (!designation) {
          return;
        }

        setEditUuid(
          uuid,
        );

        setFormData({
          departmentUuid:
            designation.department
              ?.uuid ?? "",

          name:
            designation.name,

          code:
            designation.code,

          description:
            designation.description ??
            "",
        });

        setOpen(
          true,
        );
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };

  const handleDelete =
    async (
      uuid: string,
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this designation?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await remove(
          uuid,
        );
      } catch (error: any) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };

  const columns:
    DataTableColumn[] = [
    {
      key:
        "location",

      title:
        "Location",

      render: (
        row,
      ) =>
        row.department
          ?.organizationUnit
          ?.name ?? "-",
    },

    {
      key:
        "department",

      title:
        "Department",

      render: (
        row,
      ) =>
        row.department
          ?.name ?? "-",
    },

    {
      key: "name",
      title:
        "Designation",
    },

    {
      key: "code",
      title: "Code",
    },

    {
      key:
        "description",

      title:
        "Description",

      render: (
        row,
      ) =>
        row.description ||
        "-",
    },

    {
      key: "status",
      title: "Status",
      align:
        "center",
    },

    {
      key: "actions",
      title: "Actions",
      align:
        "center",

      render: (
        row,
      ) => (
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "center",
            gap: 8,
          }}
        >
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              navigate(
                `/designations/${row.uuid}`,
              )
            }
          >
            <Eye
              size={16}
            />
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
        title="Designation"
        subtitle="Manage department designations"
        actions={
          <div
            style={{
              display:
                "flex",
              gap: 12,
            }}
          >
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  -1,
                )
              }
            >
              Back
            </Button>

            <Button
              onClick={
                handleOpenCreate
              }
            >
              Add Designation
            </Button>
          </div>
        }
      />

      <Card>
        <DataTable
          loading={
            loading
          }
          data={
            designations
          }
          columns={
            columns
          }
          keyField="uuid"
          showSerialNumber
          emptyMessage="No Designations Found."
        />
      </Card>

      <DesignationModal
        title={
          editUuid
            ? "Edit Designation"
            : "Create Designation"
        }
        isEdit={
          Boolean(
            editUuid,
          )
        }
        open={
          open
        }
        loading={
          saving
        }
        departments={
          departments
        }
        formData={
          formData
        }
        setFormData={
          setFormData
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

export default DesignationPage;