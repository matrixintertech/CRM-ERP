import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { notify } from "@/shared/utils/notify";

import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();

    notify.success(
      "Logged out successfully.",
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Matrix CRM
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconButton}
          type="button"
        >
          <Bell size={20} />
        </button>

        <div className={styles.profileWrapper}>
          <button
            type="button"
            className={styles.profile}
            onClick={() =>
              setOpen((prev) => !prev)
            }
          >
            <div className={styles.avatar}>
              {user?.displayName
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div
              className={styles.profileInfo}
            >
              <div
                className={styles.name}
              >
                {user?.displayName}
              </div>

              <div
                className={styles.role}
              >
                {user?.userType ??
                  "User"}
              </div>
            </div>

            <ChevronDown
              size={16}
            />
          </button>

          {open && (
            <div
              className={styles.dropdown}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);

                  navigate(
                    "/profile",
                  );
                }}
              >
                <User size={16} />

                My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);

                  handleLogout();
                }}
              >
                <LogOut size={16} />

                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;