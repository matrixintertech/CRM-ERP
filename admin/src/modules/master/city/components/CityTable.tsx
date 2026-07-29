import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type { City } from "../types/city.types";

interface Props {
  data: City[];
  loading: boolean;

  onView: (uuid: string) => void;

  onEdit: (uuid: string) => void;

  onDelete: (uuid: string) => void;
}

const CityTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const columns: Column<City>[] = [
    {
      key: "state",
      title: "State",
      render: (_, row) => row.state.name,
    },
    {
      key: "name",
      title: "City Name",
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
            onClick={() => onView(row.uuid)}
          >
            View
          </Button>

          <Button
            size="sm"
            onClick={() => onEdit(row.uuid)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(row.uuid)}
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

export default CityTable;