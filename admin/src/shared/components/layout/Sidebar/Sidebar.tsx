import { NavLink } from "react-router-dom";

import { menu } from "@/config/menu.config";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.menu}>
        {menu.map((item) => (
          <div
            key={item.id}
            className={styles.group}
          >
            {!item.children ? (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${styles.link} ${
                    isActive
                      ? styles.active
                      : ""
                  }`
                }
              >
                {item.title}
              </NavLink>
            ) : (
              <>
                <div
                  className={styles.groupTitle}
                >
                  {item.title}
                </div>

                <div
                  className={
                    styles.children
                  }
                >
                  {item.children.map(
                    (child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({
                          isActive,
                        }) =>
                          `${styles.link} ${
                            isActive
                              ? styles.active
                              : ""
                          }`
                        }
                      >
                        {child.title}
                      </NavLink>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;