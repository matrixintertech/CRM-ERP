import type {
  DataTableProps,
} from "./types";

import styles from "./DataTable.module.css";

function DataTable<T extends object>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = "No records found.",
  showSerialNumber = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {showSerialNumber && (
              <th
                style={{
                  width: 70,
                  textAlign: "center",
                }}
              >
                S.No.
              </th>
            )}

            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{
                  width: column.width,
                  textAlign:
                    column.align ??
                    "left",
                }}
              >
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
                  columns.length +
                  (showSerialNumber
                    ? 1
                    : 0)
                }
                className={styles.empty}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(
              (
                row,
                index,
              ) => (
                <tr
                  key={String(
                    row[keyField],
                  )}
                >
                  {showSerialNumber && (
                    <td
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      {index + 1}
                    </td>
                  )}

                  {columns.map(
                    (
                      column,
                    ) => (
                      <td
                        key={String(
                          column.key,
                        )}
                        style={{
                          textAlign:
                            column.align ??
                            "left",
                        }}
                      >
                        {column.render
                          ? column.render(
                              row,
                              index,
                            )
                          : String(
                              row[
                                column.key as keyof T
                              ] ??
                                "",
                            )}
                      </td>
                    ),
                  )}
                </tr>
              ),
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;