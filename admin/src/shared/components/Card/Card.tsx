import type { ReactNode } from "react";

import styles from "./Card.module.css";

interface CardProps {
  title?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Card = ({
  title,
  actions,
  footer,
  children,
  className = "",
}: CardProps) => {
  return (
    <div
      className={`${styles.card} ${className}`}
    >
      {(title || actions) && (
        <div className={styles.header}>
          <h3 className={styles.title}>
            {title}
          </h3>

          <div>{actions}</div>
        </div>
      )}

      <div className={styles.body}>
        {children}
      </div>

      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;