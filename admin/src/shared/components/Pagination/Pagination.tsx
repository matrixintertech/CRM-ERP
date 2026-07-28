import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalRecords?: number;
  pageSize?: number;
  onPageChange: (
    page: number,
  ) => void;
}

const Pagination = ({
  page,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        {totalRecords !== undefined &&
          pageSize !== undefined && (
            <span>
              Showing{" "}
              {(page - 1) *
                pageSize +
                1}
              {" - "}
              {Math.min(
                page * pageSize,
                totalRecords,
              )}
              {" of "}
              {totalRecords}
            </span>
          )}
      </div>

      <div className={styles.pages}>
        <button
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          Previous
        </button>

        {pages.map((item) => (
          <button
            key={item}
            onClick={() =>
              onPageChange(item)
            }
            className={
              item === page
                ? styles.active
                : ""
            }
          >
            {item}
          </button>
        ))}

        <button
          disabled={
            page === totalPages
          }
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;