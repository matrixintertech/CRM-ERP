import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type { State } from "../types/state.types";

interface Props {
  data: State[];
  loading: boolean;

  onView: (uuid: string) => void;

  onEdit: (uuid: string) => void;

  onDelete: (uuid: string) => void;
}

const StateTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns: Column<State>[] = [
    {
      key: "name",
      title: "State Name",
    },
    {
      key: "code",
      title: "Code",
    },
    {
      key: "gstCode",
      title: "GST Code",
      render: (value) =>
        value || "-",
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

export default StateTable;