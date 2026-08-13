import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";

import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  Role,
} from "../types/role.types";


interface Props {
  data: Role[];
  loading: boolean;

  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;

  onView: (
    id: string,
  ) => void;

  onEdit: (
    id: string,
  ) => void;

  onDelete: (
    id: string,
  ) => void;

  onPermissions: (
    id: string,
  ) => void;
}


const RoleTable = ({
  data,
  loading,

  canView,
  canEdit,
  canDelete,
  canManagePermissions,

  onView,
  onEdit,
  onDelete,
  onPermissions,
}: Props) => {
  const columns:
    Column<Role>[] = [
    {
      key:
        "name",

      title:
        "Role Name",
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
        value,
      ) =>
        value !== null &&
        value !== undefined &&
        value !== ""
          ? String(value)
          : "-",
    },

    {
      key:
        "status",

      title:
        "Status",

      render: (
        value,
      ) => (
        <Badge
          status={
            String(value)
          }
        />
      ),
    },

    {
      key:
        "action",

      title:
        "Action",

      render: (
        _,
        row,
      ) => {
        /*
         * System roles ko edit/delete
         * nahi karna hai.
         */
        const showEdit =
          canEdit &&
          !row.isSystem;

        const showDelete =
          canDelete &&
          !row.isSystem;

        const hasAnyAction =
          canView ||
          showEdit ||
          showDelete ||
          canManagePermissions;


        if (!hasAnyAction) {
          return "-";
        }


        return (
          <div
            style={{
              display:
                "flex",

              gap: 8,

              flexWrap:
                "wrap",
            }}
          >
            {canView && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  onView(
                    row.id,
                  )
                }
              >
                View
              </Button>
            )}


            {showEdit && (
              <Button
                size="sm"
                onClick={() =>
                  onEdit(
                    row.id,
                  )
                }
              >
                Edit
              </Button>
            )}


            {showDelete && (
              <Button
                size="sm"
                variant="danger"
                onClick={() =>
                  onDelete(
                    row.id,
                  )
                }
              >
                Delete
              </Button>
            )}


            {canManagePermissions && (
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  onPermissions(
                    row.id,
                  )
                }
              >
                Permissions
              </Button>
            )}
          </div>
        );
      },
    },
  ];


  return (
    <Table
      columns={
        columns
      }
      data={
        data
      }
      loading={
        loading
      }
    />
  );
};


export default RoleTable;