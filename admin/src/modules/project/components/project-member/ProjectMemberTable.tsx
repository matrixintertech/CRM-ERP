import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";

import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  ProjectMember,
} from "../types/project-member.types";

interface Props {
  data: ProjectMember[];
  loading: boolean;

  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

const ProjectMemberTable = ({
  data,
  loading,
  onEdit,
  onDelete,
}: Props) => {
  const columns:
    Column<ProjectMember>[] = [
    {
      key: "employee",
      title: "Employee",

      render: (_, row) => {
        const employee =
          row.employee;

        const name =
          employee.displayName ??
          [
            employee.firstName,
            employee.lastName,
          ]
            .filter(Boolean)
            .join(" ");

        return name || "-";
      },
    },

    {
      key: "projectRole",
      title: "Project Role",

      render: (_, row) =>
        row.projectRole.name,
    },

    {
      key: "designation",
      title: "Designation",

      render: (_, row) =>
        row.employee.designation
          ?.name ?? "-",
    },

    {
      key: "department",
      title: "Department",

      render: (_, row) =>
        row.employee.department
          ?.name ?? "-",
    },

    {
      key: "assignedAt",
      title: "Assigned At",

      render: (_, row) =>
        new Date(
          row.assignedAt,
        ).toLocaleDateString(
          "en-IN",
        ),
    },

    {
      key: "status",
      title: "Status",

      render: (_, row) => (
        <Badge
          status={
            row.isActive
              ? "ACTIVE"
              : "INACTIVE"
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
          }}
        >
          {row.isActive && (
            <>
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
                Remove
              </Button>
            </>
          )}
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

export default ProjectMemberTable;