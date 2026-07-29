import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type { Client } from "../types/client.types";

interface Props {
  data: Client[];
  loading: boolean;

  onView: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

const ClientTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns: Column<Client>[] = [
    {
      key: "name",
      title: "Client Name",
    },
    {
      key: "code",
      title: "Code",
    },
    {
      key: "contactName",
      title: "Contact Person",
    },
    {
      key: "mobile",
      title: "Mobile",
    },
    {
      key: "email",
      title: "Email",
      render: (value) => value || "-",
    },
    {
      key: "state",
      title: "State",
      render: (_, row) =>
        row.state?.name || "-",
    },
    {
      key: "city",
      title: "City",
      render: (_, row) =>
        row.city?.name || "-",
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <Badge status={String(value)} />
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

export default ClientTable;