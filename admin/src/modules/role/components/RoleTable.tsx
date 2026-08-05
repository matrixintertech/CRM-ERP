import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type { Role } from "../types/role.types";

interface Props {
  data: Role[];
  loading: boolean;

  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPermissions: (
    id: string,
  ) => void;
}

const RoleTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  onPermissions,
}: Props) => {
  const columns: Column<Role>[] = [
    {
      key: "name",
      title: "Role Name",
    },
    {
      key: "code",
      title: "Code",
    },
    {
      key: "description",
      title: "Description",
      render: (value) =>
        value !== null &&
        value !== undefined &&
        value !== ""
          ? String(value)
          : "-",
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <Badge
          status={String(value)}
        />
      ),
    },
    {
      key: "action",
      title: "Action",
      render: (_, row) => (
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              onView(row.id)
            }
          >
            View
          </Button>

          <Button
            size="sm"
            onClick={() =>
              onEdit(row.id)
            }
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() =>
              onDelete(row.id)
            }
          >
            Delete
          </Button>

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
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
    />
  );
};

export default RoleTable;