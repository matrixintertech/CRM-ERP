import {
  useEffect,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  X,
} from "lucide-react";

import {
  menu,
} from "@/config/menu.config";

import type {
  MenuItem,
} from "@/config/menu.config";

import {
  useAuthorization,
} from "@/shared/hooks/useAuthorization";

import styles from "./Sidebar.module.css";


interface Props {
  open: boolean;
  onClose: () => void;
}


const Sidebar = ({
  open,
  onClose,
}: Props) => {
  const {
    profile,
    portal,
    hasPermission,
  } = useAuthorization();


  /*
   * Frontend navigation visibility only.
   *
   * Portal:
   * decides which application area
   * user belongs to.
   *
   * Permission:
   * decides what user can access
   * inside that portal.
   *
   * Backend guards/policies remain
   * final authorization authority.
   */
  const canAccessItem = (
    item: MenuItem,
  ): boolean => {
    /*
     * Portal based application
     * area restriction.
     *
     * No portals configured:
     * shared item.
     *
     * Example:
     *
     * ["PLATFORM"]
     * ["COMPANY"]
     * ["CLIENT"]
     * ["VENDOR"]
     */
    if (
      item.portals &&
      item.portals.length > 0
    ) {
      if (
        !portal ||
        !item.portals.includes(
          portal,
        )
      ) {
        return false;
      }
    }


    /*
     * Temporary legacy
     * userType support.
     *
     * Menu migration complete hone
     * ke baad is block ko remove
     * kar denge.
     */
    if (
      item.userTypes &&
      item.userTypes.length > 0
    ) {
      if (
        !profile ||
        !item.userTypes.includes(
          profile.userType,
        )
      ) {
        return false;
      }
    }


    /*
     * Permission based navigation.
     *
     * Multiple permissions configured
     * hain to all required hain.
     */
    if (
      item.permissions &&
      item.permissions.length > 0
    ) {
      return item.permissions.every(
        (
          permissionCode,
        ) =>
          hasPermission(
            permissionCode,
          ),
      );
    }


    return true;
  };


  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };


    document.addEventListener(
      "keydown",
      handleEscape,
    );


    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    onClose,
  ]);


  useEffect(() => {
    if (!open) {
      return;
    }


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    open,
  ]);


  return (
    <>
      <button
        type="button"
        className={`${styles.overlay} ${
          open
            ? styles.overlayOpen
            : ""
        }`}
        onClick={
          onClose
        }
        aria-label="Close navigation menu"
      />


      <aside
        className={`${styles.sidebar} ${
          open
            ? styles.sidebarOpen
            : ""
        }`}
        aria-label="Main navigation"
      >
        <div
          className={
            styles.mobileHeader
          }
        >
          <div
            className={
              styles.mobileTitle
            }
          >
            Navigation
          </div>


          <button
            type="button"
            className={
              styles.closeButton
            }
            onClick={
              onClose
            }
            aria-label="Close navigation menu"
          >
            <X
              size={22}
              strokeWidth={1.8}
            />
          </button>
        </div>


        <nav
          className={
            styles.menu
          }
        >
          {menu.map(
            (item) => {
              /*
               * Parent itself portal /
               * permission restricted hai
               * to hide karo.
               */
              if (
                !canAccessItem(
                  item,
                )
              ) {
                return null;
              }


              const ItemIcon =
                item.icon;


              /*
               * Simple menu item.
               */
              if (
                !item.children
              ) {
                return (
                  <div
                    key={
                      item.id
                    }
                    className={
                      styles.group
                    }
                  >
                    <NavLink
                      to={
                        item.path
                      }
                      onClick={
                        onClose
                      }
                      className={({
                        isActive,
                      }) =>
                        `${
                          styles.link
                        } ${
                          isActive
                            ? styles.active
                            : ""
                        }`
                      }
                    >
                      {ItemIcon && (
                        <ItemIcon
                          size={18}
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
                  </div>
                );
              }


              /*
               * Portal + permission
               * ke according children
               * filter karo.
               */
              const visibleChildren =
                item.children.filter(
                  (
                    child,
                  ) =>
                    canAccessItem(
                      child,
                    ),
                );


              /*
               * Group ka koi child
               * visible nahi hai to
               * parent bhi hide.
               */
              if (
                visibleChildren.length ===
                0
              ) {
                return null;
              }


              return (
                <div
                  key={
                    item.id
                  }
                  className={
                    styles.group
                  }
                >
                  <div
                    className={
                      styles.groupTitle
                    }
                  >
                    {ItemIcon && (
                      <ItemIcon
                        size={18}
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
                    {visibleChildren.map(
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
                            onClick={
                              onClose
                            }
                            className={({
                              isActive,
                            }) =>
                              `${
                                styles.link
                              } ${
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
                </div>
              );
            },
          )}
        </nav>
      </aside>
    </>
  );
};


export default Sidebar;