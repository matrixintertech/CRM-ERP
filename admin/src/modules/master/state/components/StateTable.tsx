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
  State,
} from "../types/state.types";

import styles from "./StateTable.module.css";

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
  const columns = useMemo<
    Column<State>[]
  >(
    () => [
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
          value !== null &&
          value !== undefined &&
          value !== ""
            ? String(value)
            : "-",
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
              onClick={() =>
                onView(row.uuid)
              }
            >
              <Eye size={16} />
            </Button>

            <Button
              size="sm"
              aria-label={`Edit ${row.name}`}
              onClick={() =>
                onEdit(row.uuid)
              }
            >
              <SquarePen
                size={16}
              />
            </Button>

            <Button
              size="sm"
              variant="danger"
              aria-label={`Delete ${row.name}`}
              onClick={() =>
                onDelete(row.uuid)
              }
            >
              <Trash2
                size={16}
              />
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

export default StateTable;