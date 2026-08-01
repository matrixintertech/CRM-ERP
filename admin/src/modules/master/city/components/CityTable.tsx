import { useMemo } from "react";

import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

import Badge from "@/shared/components/Badge";
import Button from "@/shared/components/Button";
import Table, {
  type Column,
} from "@/shared/components/Table";

import type {
  City,
} from "../types/city.types";

import styles from "./CityTable.module.css";

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
  const columns = useMemo<
    Column<City>[]
  >(
    () => [
      {
        key: "state",
        title: "State",
        render: (_, row) =>
          row.state?.name ?? "-",
      },
      {
        key: "name",
        title: "City Name",
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
            className={
              styles.actions
            }
          >
            <Button
              size="sm"
              variant="secondary"
              aria-label={`View ${row.name}`}
              title="View city"
              onClick={() =>
                onView(row.uuid)
              }
            >
              <Eye size={16} />
            </Button>

            <Button
              size="sm"
              aria-label={`Edit ${row.name}`}
              title="Edit city"
              onClick={() =>
                onEdit(row.uuid)
              }
            >
              <SquarePen size={16} />
            </Button>

            <Button
              size="sm"
              variant="danger"
              aria-label={`Delete ${row.name}`}
              title="Delete city"
              onClick={() =>
                onDelete(row.uuid)
              }
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [
      onView,
      onEdit,
      onDelete,
    ],
  );

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
    />
  );
};

export default CityTable;