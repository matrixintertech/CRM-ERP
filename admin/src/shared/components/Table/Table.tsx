import type { ReactNode } from "react";

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
}

const Table = <T,>({
  columns,
  data,
}: TableProps<T>) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key.toString()}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length
                }
                className={styles.empty}
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map(
              (
                row,
                rowIndex,
              ) => (
                <tr key={rowIndex}>
                  {columns.map(
                    (column) => {
                      const value =
                        (
                          row as Record<
                            string,
                            unknown
                          >
                        )[column.key.toString()];

                      return (
                        <td
                          key={column.key.toString()}
                        >
                          {column.render
                            ? column.render(
                                value,
                                row,
                              )
                            : String(
                                value ?? "",
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