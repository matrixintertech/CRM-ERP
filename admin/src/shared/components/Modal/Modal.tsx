import {
  type ReactNode,
  useEffect,
} from "react";

import styles from "./Modal.module.css";

interface Props {
  open: boolean;

  title: string;

  children: ReactNode;

  onClose: () => void;

  footer?: ReactNode;

  size?: "sm" | "md" | "lg" | "xl";

  showCloseButton?: boolean;
}

const Modal = ({
  open,
  title,
  children,
  onClose,
  footer,
  size = "md",
  showCloseButton = true,
}: Props) => {



  useEffect(() => {
  if (!open) return;

  const handleKeyDown = (
    e: KeyboardEvent,
  ) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.body.style.overflow =
    "hidden";

  window.addEventListener(
    "keydown",
    handleKeyDown,
  );

  return () => {
    document.body.style.overflow =
      "";

    window.removeEventListener(
      "keydown",
      handleKeyDown,
    );
  };
}, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
    <div
  role="dialog"
  aria-modal="true"
  className={`${styles.modal} ${styles[size]}`}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className={styles.header}>
          <h3>{title}</h3>

         {showCloseButton && (
  <button
    className={styles.close}
    onClick={onClose}
  >
    ×
  </button>
)}
        </div>

        <div className={styles.body}>
          {children}
        </div>

        {footer && (
  <div className={styles.footer}>
    {footer}
  </div>
)}
      </div>
    </div>
  );
};

export default Modal;