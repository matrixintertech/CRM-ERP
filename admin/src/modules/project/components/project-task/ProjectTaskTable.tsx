import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";

import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  ProjectTask,
} from "../../types/project-task.types";

interface Props {
  data: ProjectTask[];
  loading: boolean;

  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

const formatDate = (
  value?: string | null,
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
  );
};

const getAssigneeName = (
  task: ProjectTask,
) => {
  const member =
    task.assignedProjectMember;

  if (!member) {
    return "Unassigned";
  }

  const employee =
    member.employee;

  return (
    employee.displayName ||
    [
      employee.firstName,
      employee.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    employee.employeeCode ||
    "-"
  );
};

const ProjectTaskTable = ({
  data,
  loading,
  onEdit,
  onDelete,
}: Props) => {
  const columns:
    Column<ProjectTask>[] = [
    {
      key: "title",
      title: "Task",
    },

    {
      key: "assignedProjectMember",
      title: "Assigned To",

      render: (_, row) =>
        getAssigneeName(row),
    },

    {
      key: "projectRole",
      title: "Role",

      render: (_, row) =>
        row.assignedProjectMember
          ?.projectRole.name ??
        "-",
    },

    {
      key: "priority",
      title: "Priority",

      render: (_, row) => (
        <Badge
          status={
            row.priority
          }
        />
      ),
    },

    {
      key: "startDate",
      title: "Start Date",

      render: (_, row) =>
        formatDate(
          row.startDate,
        ),
    },

    {
      key: "dueDate",
      title: "Due Date",

      render: (_, row) =>
        formatDate(
          row.dueDate,
        ),
    },

    {
      key: "status",
      title: "Status",

      render: (_, row) => (
        <Badge
          status={
            row.status
          }
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
            flexWrap: "wrap",
          }}
        >
          <Button
            size="sm"
            onClick={() =>
              onEdit(
                row.uuid,
              )
            }
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() =>
              onDelete(
                row.uuid,
              )
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

export default ProjectTaskTable;