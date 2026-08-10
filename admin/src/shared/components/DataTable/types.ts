import type {
  ReactNode,
} from "react";

export interface DataTableColumn<T> {
  key: keyof T | string;

  title: string;

  width?: string;

  align?:
    | "left"
    | "center"
    | "right";

  render?: (
    row: T,
  ) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];

  data: T[];

  keyField: keyof T;

  loading?: boolean;

  emptyMessage?: string;

  showSerialNumber?: boolean;

  serialNumberStart?: number;
}