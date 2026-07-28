import { useState } from "react";

import LoginLeft from "../components/LoginLeft";
import LoginRight from "../components/LoginRight";
import LoginForm from "../components/LoginForm";
import OtpForm from "../components/OtpForm";

import styles from "../styles/LoginPage.module.css";

const LoginPage = () => {
  const [receiver, setReceiver] =
    useState("");

  return (
    <div className={styles.container}>
      <LoginLeft />

      <LoginRight>
        {receiver ? (
          <OtpForm
            receiver={receiver}
            onBack={() =>
              setReceiver("")
            }
          />
        ) : (
          <LoginForm
            onSuccess={setReceiver}
          />
        )}
      </LoginRight>
    </div>
  );
};

export default LoginPage;