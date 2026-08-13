import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

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

import DepartmentModal from "../components/DepartmentModal";

import {
  useDepartment,
} from "../hooks/useDepartment";

import {
  useOrganizationUnits,
} from "../../organization-unit/hooks/useOrganizationUnits";

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
  const navigate =
    useNavigate();


  /*
   * Frontend authorization is UX only.
   *
   * Actual authorization + scope
   * enforcement backend handles.
   */
  const {
    hasPermission,
  } = useAuthorization();


  const canViewDepartment =
    hasPermission(
      "company.department.view",
    );

  const canCreateDepartment =
    hasPermission(
      "company.department.create",
    );

  const canUpdateDepartment =
    hasPermission(
      "company.department.update",
    );

  const canDeleteDepartment =
    hasPermission(
      "company.department.delete",
    );


  const {
    loading,
    departments,

    fetchDepartment,

    create,
    update,
    remove,

    saving,
  } = useDepartment();


  const {
    organizationUnits,
  } = useOrganizationUnits();


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
    useState<DepartmentFormData>(
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
      if (
        !canCreateDepartment
      ) {
        return;
      }

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
      /*
       * UI-level protection.
       *
       * Backend is still final
       * authorization authority.
       */
      if (
        editUuid &&
        !canUpdateDepartment
      ) {
        return;
      }

      if (
        !editUuid &&
        !canCreateDepartment
      ) {
        return;
      }


      try {
        const payload:
          DepartmentFormData = {
          organizationUnitUuid:
            formData.organizationUnitUuid,

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
      } catch (
        error: any
      ) {
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
      if (
        !canUpdateDepartment
      ) {
        return;
      }


      try {
        const department =
          await fetchDepartment(
            uuid,
          );


        if (!department) {
          return;
        }


        setEditUuid(
          uuid,
        );


        setFormData({
          organizationUnitUuid:
            department
              .organizationUnit
              ?.uuid ?? "",

          name:
            department.name,

          code:
            department.code,

          description:
            department.description ??
            "",
        });


        setOpen(
          true,
        );
      } catch (
        error: any
      ) {
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
      if (
        !canDeleteDepartment
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this department?",
        );


      if (!confirmed) {
        return;
      }


      try {
        await remove(
          uuid,
        );
      } catch (
        error: any
      ) {
        console.error(
          error?.response?.data ??
            error,
        );
      }
    };


  const columns:
    DataTableColumn<Department>[] = [
    {
      key:
        "organizationUnit",

      title:
        "Branch / Office",

      render: (
        row,
      ) =>
        row.organizationUnit
          ?.name ?? "-",
    },

    {
      key:
        "name",

      title:
        "Department",
    },

    {
      key:
        "code",

      title:
        "Code",
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
      key:
        "status",

      title:
        "Status",

      align:
        "center",
    },

    {
      key:
        "actions",

      title:
        "Actions",

      align:
        "center",

      render: (
        row,
      ) => {
        const hasAnyAction =
          canViewDepartment ||
          canUpdateDepartment ||
          canDeleteDepartment;


        if (!hasAnyAction) {
          return "-";
        }


        return (
          <div
            style={{
              display:
                "flex",

              justifyContent:
                "center",

              gap: 8,
            }}
          >
            {canViewDepartment && (
              <Button
                size="sm"
                variant="secondary"
                aria-label={`View ${row.name}`}
                title="View department"
                onClick={() =>
                  navigate(
                    `/departments/${row.uuid}`,
                  )
                }
              >
                <Eye
                  size={16}
                />
              </Button>
            )}


            {canUpdateDepartment && (
              <Button
                size="sm"
                aria-label={`Edit ${row.name}`}
                title="Edit department"
                onClick={() =>
                  void handleEdit(
                    row.uuid,
                  )
                }
              >
                <SquarePen
                  size={16}
                />
              </Button>
            )}


            {canDeleteDepartment && (
              <Button
                size="sm"
                variant="danger"
                aria-label={`Delete ${row.name}`}
                title="Delete department"
                onClick={() =>
                  void handleDelete(
                    row.uuid,
                  )
                }
              >
                <Trash2
                  size={16}
                />
              </Button>
            )}
          </div>
        );
      },
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


            {canCreateDepartment && (
              <Button
                onClick={
                  handleOpenCreate
                }
              >
                Add Department
              </Button>
            )}
          </div>
        }
      />


      <Card>
        <DataTable
          loading={
            loading
          }
          data={
            departments
          }
          columns={
            columns
          }
          keyField="uuid"
          showSerialNumber
          emptyMessage="No Departments Found."
        />
      </Card>


      {(canCreateDepartment ||
        canUpdateDepartment) && (
        <DepartmentModal
          title={
            editUuid
              ? "Edit Department"
              : "Create Department"
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
          formData={
            formData
          }
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
      )}
    </>
  );
};


export default DepartmentPage;