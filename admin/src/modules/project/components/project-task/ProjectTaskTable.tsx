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

  canEdit?: boolean;
  canDelete?: boolean;
  canReview?: boolean;
  canViewActivity?: boolean;

  onEdit: (
    uuid: string,
  ) => void;

  onDelete: (
    uuid: string,
  ) => void;

  onReview?: (
    task: ProjectTask,
  ) => void;

  onActivity?: (
    task: ProjectTask,
  ) => void;
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
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
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


const hasPendingCompletionRequest = (
  task: ProjectTask,
) => {
  return Boolean(
    task.completionRequests?.some(
      (request) =>
        request.status ===
        "PENDING",
    ),
  );
};


const ProjectTaskTable = ({
  data,
  loading,

  canEdit = true,
  canDelete = true,
  canReview = false,
  canViewActivity = true,

  onEdit,
  onDelete,
  onReview,
  onActivity,
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
        getAssigneeName(
          row,
        ),
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

      render: (_, row) => {
        const awaitingReview =
          row.status ===
            "COMPLETION_REQUESTED" &&
          hasPendingCompletionRequest(
            row,
          );

        if (
          awaitingReview
        ) {
          return (
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  6,
              }}
            >
              <Badge
                status={
                  row.status
                }
              />

              <span
                style={{
                  fontSize:
                    12,

                  fontWeight:
                    600,

                  color:
                    "#92400e",
                }}
              >
                Awaiting Review
              </span>
            </div>
          );
        }

        return (
          <Badge
            status={
              row.status
            }
          />
        );
      },
    },

    {
      key: "action",
      title: "Action",

      render: (_, row) => {
        const awaitingReview =
          row.status ===
            "COMPLETION_REQUESTED" &&
          hasPendingCompletionRequest(
            row,
          );

        return (
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                8,

              flexWrap:
                "wrap",
            }}
          >
            {canViewActivity &&
              onActivity && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    onActivity(
                      row,
                    )
                  }
                >
                  View Activity
                </Button>
              )}


            {canReview &&
              awaitingReview &&
              onReview && (
                <Button
                  size="sm"
                  onClick={() =>
                    onReview(
                      row,
                    )
                  }
                >
                  Review
                </Button>
              )}


            {canEdit &&
              !awaitingReview && (
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
              )}


            {canDelete &&
              !awaitingReview && (
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


export default ProjectTaskTable;