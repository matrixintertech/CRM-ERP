import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  ProjectCategory,
} from "../types/project-category.types";

interface Props {
  data: ProjectCategory[];
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

const ProjectCategoryTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns:
    Column<ProjectCategory>[] = [
    {
      key: "name",
      title: "Category Name",
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
      key: "color",
      title: "Color",

      render: (value) => {
        const displayValue =
          getDisplayValue(value);

        const color =
          displayValue === "-"
            ? "#D1D5DB"
            : displayValue;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor:
                  color,
                border:
                  "1px solid #ccc",
                flexShrink: 0,
              }}
            />

            <span>
              {displayValue}
            </span>
          </div>
        );
      },
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

export default ProjectCategoryTable;