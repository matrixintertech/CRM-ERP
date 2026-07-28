import type { ReactNode } from "react";

import Card from "@/shared/components/Card";

import styles from "./DashboardCard.module.css";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

const DashboardCard = ({
  title,
  value,
  icon,
}: DashboardCardProps) => {
  return (
    <Card>
      <div className={styles.card}>
        <div>
          <p className={styles.title}>
            {title}
          </p>

          <h2 className={styles.value}>
            {value}
          </h2>
        </div>

        {icon && (
          <div className={styles.icon}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;