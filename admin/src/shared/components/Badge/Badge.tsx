import styles from "./Badge.module.css";

type BadgeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "DRAFT"
  | "SUSPENDED";

interface BadgeProps {
  status?: BadgeStatus | string | null;
}

const formatLabel = (
  value: string,
) =>
  value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");

const Badge = ({
  status,
}: BadgeProps) => {
  if (!status) {
    return (
      <span
        className={`${styles.badge} ${styles.default}`}
      >
        -
      </span>
    );
  }

  const variant =
    status.toLowerCase();

  return (
    <span
      className={`${styles.badge} ${
        styles[variant] ??
        styles.default
      }`}
    >
      {formatLabel(status)}
    </span>
  );
};

export default Badge;