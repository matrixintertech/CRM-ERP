import { NavLink } from "react-router-dom";

import { X } from "lucide-react";

import { useEffect } from "react";

import { menu } from "@/config/menu.config";

import styles from "./Sidebar.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: Props) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-label="Close navigation menu"
      />

      <aside
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}
        aria-label="Main navigation"
      >
        <div className={styles.mobileHeader}>
          <div className={styles.mobileTitle}>Navigation</div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        <nav className={styles.menu}>
          {menu.map((item) => {
            const ItemIcon = item.icon;

            return (
              <div key={item.id} className={styles.group}>
                {!item.children ? (
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${styles.link} ${isActive ? styles.active : ""}`
                    }
                  >
                    {ItemIcon && (
                      <ItemIcon
                        size={18}
                        strokeWidth={1.8}
                        className={styles.icon}
                      />
                    )}

                    <span>{item.title}</span>
                  </NavLink>
                ) : (
                  <>
                    <div className={styles.groupTitle}>
                      {ItemIcon && (
                        <ItemIcon
                          size={18}
                          strokeWidth={1.8}
                          className={styles.icon}
                        />
                      )}

                      <span>{item.title}</span>
                    </div>

                    <div className={styles.children}>
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;

                        return (
                          <NavLink
                            key={child.id}
                            to={child.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `${styles.link} ${isActive ? styles.active : ""}`
                            }
                          >
                            {ChildIcon && (
                              <ChildIcon
                                size={16}
                                strokeWidth={1.8}
                                className={styles.icon}
                              />
                            )}

                            <span>{child.title}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
