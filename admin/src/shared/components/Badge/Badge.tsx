import styles from "./Badge.module.css";

type BadgeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "DRAFT"
  | "SUSPENDED";

interface BadgeProps {
  status: BadgeStatus | string;
}

const Badge = ({
  status,
}: BadgeProps) => {
  const variant =
    status.toLowerCase();

  return (
    <span
      className={`${styles.badge} ${
        styles[variant] ??
        styles.default
      }`}
    >
      {status}
    </span>
  );
};

export default Badge;