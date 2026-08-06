import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, { type Column } from "@/shared/components/Table";

import type { PlatformUser } from "../types/platform-user.types";

interface Props {
  data: PlatformUser[];
  loading: boolean;

  onView: (uuid: string) => void;

  onEdit: (uuid: string) => void;

  onDelete: (uuid: string) => void;
}

const PlatformUserTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns: Column<PlatformUser>[] = [
    {
      key: "displayName",
      title: "Name",
      render: (_, row) => row.displayName || "-",
    },
    {
      key: "email",
      title: "Email",
      render: (_, row) => row.email || "-",
    },
    {
      key: "mobile",
      title: "Mobile",
      render: (_, row) => row.mobile || "-",
    },
    {
      key: "status",
      title: "Status",
      render: (_, row) => <Badge status={row.status} />,
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
            onClick={() => onView(row.uuid)}
          >
            View
          </Button>

          <Button size="sm" onClick={() => onEdit(row.uuid)}>
            Edit
          </Button>

          <Button size="sm" variant="danger" onClick={() => onDelete(row.uuid)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={data} loading={loading} />;
};

export default PlatformUserTable;
