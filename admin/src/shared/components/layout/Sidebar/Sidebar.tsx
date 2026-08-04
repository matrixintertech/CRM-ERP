import {
  NavLink,
} from "react-router-dom";

import {
  menu,
} from "@/config/menu.config";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside
      className={
        styles.sidebar
      }
    >
      <nav
        className={
          styles.menu
        }
      >
        {menu.map(
          (item) => {
            const ItemIcon =
              item.icon;

            return (
              <div
                key={
                  item.id
                }
                className={
                  styles.group
                }
              >
                {!item.children ? (
                  <NavLink
                    to={
                      item.path
                    }
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
                    {ItemIcon && (
                      <ItemIcon
                        size={
                          18
                        }
                        strokeWidth={
                          1.8
                        }
                        className={
                          styles.icon
                        }
                      />
                    )}

                    <span>
                      {
                        item.title
                      }
                    </span>
                  </NavLink>
                ) : (
                  <>
                    <div
                      className={
                        styles.groupTitle
                      }
                    >
                      {ItemIcon && (
                        <ItemIcon
                          size={
                            18
                          }
                          strokeWidth={
                            1.8
                          }
                          className={
                            styles.icon
                          }
                        />
                      )}

                      <span>
                        {
                          item.title
                        }
                      </span>
                    </div>

                    <div
                      className={
                        styles.children
                      }
                    >
                      {item.children.map(
                        (
                          child,
                        ) => {
                          const ChildIcon =
                            child.icon;

                          return (
                            <NavLink
                              key={
                                child.id
                              }
                              to={
                                child.path
                              }
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
                              {ChildIcon && (
                                <ChildIcon
                                  size={
                                    16
                                  }
                                  strokeWidth={
                                    1.8
                                  }
                                  className={
                                    styles.icon
                                  }
                                />
                              )}

                              <span>
                                {
                                  child.title
                                }
                              </span>
                            </NavLink>
                          );
                        },
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          },
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;