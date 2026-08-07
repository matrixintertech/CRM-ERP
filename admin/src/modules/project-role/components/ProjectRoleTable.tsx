import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";

import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  ProjectRole,
} from "../types/project-role.types";

interface Props {
  data: ProjectRole[];
  loading: boolean;

  onView: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

const getDisplayValue = (
  value: unknown,
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return String(value);
};

const ProjectRoleTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns: Column<ProjectRole>[] = [
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
        getDisplayValue(value),
    },

    {
      key: "isSingleAssignee",
      title: "Assignment Type",

      render: (_, row) =>
        row.isSingleAssignee
          ? "Single Assignee"
          : "Multiple Assignees",
    },

    {
      key: "sortOrder",
      title: "Sort Order",

      render: (value) =>
        getDisplayValue(value),
    },

    {
      key: "status",
      title: "Status",

      render: (_, row) => (
        <Badge
          status={row.status}
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
              onView(row.uuid)
            }
          >
            View
          </Button>

          <Button
            size="sm"
            onClick={() =>
              onEdit(row.uuid)
            }
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() =>
              onDelete(row.uuid)
            }
          >
            Delete
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

export default ProjectRoleTable;