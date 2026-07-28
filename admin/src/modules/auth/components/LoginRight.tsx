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

        <h2>Matrix CRM</h2>

        <p className={styles.subtitle}>
          Sign in using your registered account.
        </p>

        {children}
      </div>
    </div>
  );
};

export default LoginRight;