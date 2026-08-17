import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDocumentTitle,
} from "@/shared/hooks/useDocumentTitle";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import {
  KeyRound,
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

import RoleModal from "../components/RoleModal";

import {
  useRole,
} from "../hooks/useRoles";

import type {
  Role,
  RoleFormData,
  UpdateRoleDto,
} from "../types/role.types";


const createDefaultForm =
  (): RoleFormData => ({
    name: "",
    code: "",
    description: "",
    status: "ACTIVE",
  });


const RolePage = () => {
  const navigate =
    useNavigate();


  useDocumentTitle(
    "User Roles",
  );


  const {
    hasPermission,
  } = useAuthorization();


  const canCreateRole =
    hasPermission(
      "company.role.create",
    );

  const canUpdateRole =
    hasPermission(
      "company.role.update",
    );

  const canDeleteRole =
    hasPermission(
      "company.role.delete",
    );


  /*
   * Role permission assignment
   * role bundle ko modify karta hai.
   */
  const canManageRolePermissions =
    canUpdateRole;


  const {
    loading,
    roles,

    fetchRole,

    create,
    update,
    remove,

    saving,
  } = useRole();


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
    useState<RoleFormData>(
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


  const handleClose =
    () => {
      setOpen(
        false,
      );

      resetForm();
    };


  const handleCreateOpen =
    () => {
      if (
        !canCreateRole
      ) {
        return;
      }


      resetForm();

      setOpen(
        true,
      );
    };


 const handleSubmit =
  async () => {
    if (
      editUuid &&
      !canUpdateRole
    ) {
      return;
    }


    if (
      !editUuid &&
      !canCreateRole
    ) {
      return;
    }


    try {
      if (editUuid) {
        const payload:
          UpdateRoleDto = {
          name:
            formData.name.trim(),

          code:
            formData.code
              .trim()
              .toUpperCase(),

          description:
            formData.description
              .trim() ||
            undefined,

          status:
            formData.status,
        };


        await update(
          editUuid,
          payload,
        );
      } else {
        await create({
          name:
            formData.name.trim(),

          code:
            formData.code
              .trim()
              .toUpperCase(),

          description:
            formData.description
              .trim() ||
            undefined,
        });
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
        !canUpdateRole
      ) {
        return;
      }


      try {
        const role =
          await fetchRole(
            uuid,
          );


        if (!role) {
          return;
        }


        setEditUuid(
          uuid,
        );


        setFormData({
          name:
            role.name,

          code:
            role.code,

          description:
            role.description ??
            "",

          status:
            role.status,
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


  const handleManagePermissions =
    (
      uuid: string,
    ) => {
      if (
        !canManageRolePermissions
      ) {
        return;
      }


      navigate(
        `/settings/roles/${uuid}/permissions`,
      );
    };


  const handleDelete =
    async (
      uuid: string,
    ) => {
      if (
        !canDeleteRole
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this role?",
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
    DataTableColumn<Role>[] = [
    {
      key:
        "name",

      title:
        "Role",
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
        "employees",

      title:
        "Employees",

      align:
        "center",

      render: (
        row,
      ) =>
        row._count
          ?.employees ??
        0,
    },

    {
      key:
        "isSystem",

      title:
        "Type",

      align:
        "center",

      render: (
        row,
      ) =>
        row.isSystem
          ? "System"
          : "Custom",
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
        const showEdit =
          canUpdateRole &&
          !row.isSystem;

        const showDelete =
          canDeleteRole &&
          !row.isSystem;


        const hasAnyAction =
          canManageRolePermissions ||
          showEdit ||
          showDelete;


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
            {canManageRolePermissions && (
              <Button
                size="sm"
                aria-label={`Assign permissions to ${row.name}`}
                title="Assign Permissions"
                onClick={() =>
                  handleManagePermissions(
                    row.uuid,
                  )
                }
              >
                <KeyRound
                  size={16}
                />
              </Button>
            )}


            {showEdit && (
              <Button
                size="sm"
                aria-label={`Edit ${row.name}`}
                title="Edit Role"
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


            {showDelete && (
              <Button
                size="sm"
                variant="danger"
                aria-label={`Delete ${row.name}`}
                title="Delete Role"
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
        title="Roles"
        subtitle="Manage company roles and permissions"
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


            {canCreateRole && (
              <Button
                onClick={
                  handleCreateOpen
                }
              >
                Add Role
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
            roles
          }
          columns={
            columns
          }
          keyField="uuid"
          showSerialNumber
          emptyMessage="No Roles Found."
        />
      </Card>


      {(canCreateRole ||
        canUpdateRole) && (
        <RoleModal
          title={
            editUuid
              ? "Edit Role"
              : "Create Role"
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


export default RolePage;