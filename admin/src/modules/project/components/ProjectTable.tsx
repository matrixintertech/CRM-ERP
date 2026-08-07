import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";

import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  Project,
} from "../types/project.types";

interface Props {
  data: Project[];
  loading: boolean;

  onView: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
  onMembers: (uuid: string) => void;
}

const formatDate = (
  value: unknown,
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const date = new Date(
    String(value),
  );

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

const ProjectTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  onMembers,
}: Props) => {
  const columns:
    Column<Project>[] = [
    {
      key: "srn",
      title: "SRN",
    },

    {
      key: "name",
      title: "Project Name",
    },

    {
      key: "client",
      title: "Client",

      render: (_, row) =>
        row.client?.name ?? "-",
    },

    {
      key: "category",
      title: "Category",

      render: (_, row) =>
        row.category?.name ?? "-",
    },

    {
      key: "organizationUnit",
      title: "Branch",

      render: (_, row) =>
        row.organizationUnit
          ?.name ?? "-",
    },

    {
      key: "state",
      title: "State",

      render: (_, row) =>
        row.state?.name ?? "-",
    },

    {
      key: "city",
      title: "City",

      render: (_, row) =>
        row.city?.name ?? "-",
    },

    {
      key: "startDate",
      title: "Start Date",

      render: (value) =>
        formatDate(value),
    },

    {
      key: "expectedEndDate",
      title: "Expected End",

      render: (value) =>
        formatDate(value),
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
            flexWrap: "wrap",
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
            variant="secondary"
            onClick={() =>
              onMembers(
                row.uuid,
              )
            }
          >
            Members
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

export default ProjectTable;