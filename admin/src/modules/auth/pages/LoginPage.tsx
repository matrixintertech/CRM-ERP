import { useState } from "react";

import LoginLeft from "../components/LoginLeft";
import LoginRight from "../components/LoginRight";
import LoginForm from "../components/LoginForm";
import OtpForm from "../components/OtpForm";

import styles from "../styles/LoginPage.module.css";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");

  return (
    <div className={styles.container}>
      <LoginLeft />

      <LoginRight>
        {identifier ? (
          <OtpForm identifier={identifier} onBack={() => setIdentifier("")} />
        ) : (
          <LoginForm onSuccess={setIdentifier} />
        )}
      </LoginRight>
    </div>
  );
};

export default LoginPage;
