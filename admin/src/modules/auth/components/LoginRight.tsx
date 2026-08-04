import type { ReactNode } from "react";

import styles from "../styles/LoginPage.module.css";

interface Props {
  children: ReactNode;
}

const LoginRight = ({
  children,
}: Props) => {
  return (
    <div className={styles.right}>
      <div className={styles.loginBox}>
        <h2>
          Welcome Back
        </h2>

        <p className={styles.subtitle}>
          Sign in securely using
          your registered email
          address. We'll send a
          one-time verification
          code to continue.
        </p>

        {children}

        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          Protected by secure
          OTP authentication
        </div>
      </div>
    </div>
  );
};

export default LoginRight;