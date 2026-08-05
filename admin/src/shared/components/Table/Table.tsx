import type {
  ReactNode,
} from "react";

import styles from "./Table.module.css";

export interface Column<T> {
  key: keyof T | string;
  title: string;

  render?: (
    value: unknown,
    row: T,
  ) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];

  loading?: boolean;

  emptyMessage?: string;

  rowKey?: (
    row: T,
    index: number,
  ) => string | number;
}

const Table = <T,>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
  rowKey,
}: TableProps<T>) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(
              (column) => (
                <th
                  key={column.key.toString()}
                >
                  {column.title}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.empty}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.empty}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(
              (
                row,
                rowIndex,
              ) => (
                <tr
                  key={
                    rowKey
                      ? rowKey(
                          row,
                          rowIndex,
                        )
                      : rowIndex
                  }
                >
                  {columns.map(
                    (column) => {
                      const value =
                        (
                          row as Record<
                            string,
                            unknown
                          >
                        )[
                          column.key.toString()
                        ];

                      return (
                        <td
                          key={
                            column.key.toString()
                          }
                        >
                          {column.render
                            ? column.render(
                                value,
                                row,
                              )
                            : String(
                                value ??
                                  "",
                              )}
                        </td>
                      );
                    },
                  )}
                </tr>
              ),
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;