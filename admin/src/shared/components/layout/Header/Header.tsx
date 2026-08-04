import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

import {
  useAuth,
} from "@/app/providers/AuthProvider";

import {
  notify,
} from "@/shared/utils/notify";

import styles from "./Header.module.css";

const formatUserType = (
  value?: string | null,
) => {
  if (!value) {
    return "User";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
};

const Header = () => {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    open,
    setOpen,
  ] = useState(false);

  const profileWrapperRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        profileWrapperRef.current &&
        !profileWrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  const displayName =
    user?.displayName ??
    user?.email ??
    "User";

  const initial =
    displayName
      .charAt(0)
      .toUpperCase();

  const handleLogout = () => {
    setOpen(false);

    logout();

    notify.success(
      "Logged out successfully.",
    );

    navigate(
      "/login",
      {
        replace: true,
      },
    );
  };

  const handleProfile = () => {
    setOpen(false);

    navigate(
      "/settings/profile",
    );
  };

  return (
    <header
      className={
        styles.header
      }
    >
      <button
        type="button"
        className={
          styles.logo
        }
        onClick={() =>
          navigate(
            "/dashboard",
          )
        }
        aria-label="Go to dashboard"
      >
        <span
          className={
            styles.logoMark
          }
        >
          M
        </span>

        <span
          className={
            styles.logoText
          }
        >
          Matrix CRM
        </span>
      </button>

      <div
        className={
          styles.right
        }
      >
        <button
          className={
            styles.iconButton
          }
          type="button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell
            size={20}
            strokeWidth={1.8}
          />

          <span
            className={
              styles.notificationBadge
            }
          >
            3
          </span>
        </button>

        <div
          ref={
            profileWrapperRef
          }
          className={
            styles.profileWrapper
          }
        >
          <button
            type="button"
            className={
              styles.profile
            }
            onClick={() =>
              setOpen(
                (previous) =>
                  !previous,
              )
            }
            aria-expanded={
              open
            }
            aria-haspopup="menu"
          >
            {user?.profilePhoto ? (
              <img
                src={
                  user.profilePhoto
                }
                alt={
                  displayName
                }
                className={
                  styles.avatarImage
                }
              />
            ) : (
              <div
                className={
                  styles.avatar
                }
              >
                {initial}
              </div>
            )}

            <div
              className={
                styles.profileInfo
              }
            >
              <div
                className={
                  styles.name
                }
              >
                {displayName}
              </div>

              <div
                className={
                  styles.role
                }
              >
                {formatUserType(
                  user?.userType,
                )}
              </div>
            </div>

            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className={`${styles.chevron} ${
                open
                  ? styles.chevronOpen
                  : ""
              }`}
            />
          </button>

          {open && (
            <div
              className={
                styles.dropdown
              }
              role="menu"
            >
              <div
                className={
                  styles.dropdownHeader
                }
              >
                <div
                  className={
                    styles.dropdownName
                  }
                >
                  {displayName}
                </div>

                <div
                  className={
                    styles.dropdownEmail
                  }
                >
                  {user?.email ??
                    user?.mobile ??
                    "-"}
                </div>
              </div>

              <div
                className={
                  styles.dropdownDivider
                }
              />

              <button
                type="button"
                role="menuitem"
                onClick={
                  handleProfile
                }
              >
                <User
                  size={17}
                  strokeWidth={1.8}
                />

                <span>
                  My Profile
                </span>
              </button>

              <div
                className={
                  styles.dropdownDivider
                }
              />

              <button
                type="button"
                role="menuitem"
                className={
                  styles.logoutButton
                }
                onClick={
                  handleLogout
                }
              >
                <LogOut
                  size={17}
                  strokeWidth={1.8}
                />

                <span>
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;