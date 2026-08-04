import styles from "../styles/LoginPage.module.css";

const LoginLeft = () => {
  return (
    <div className={styles.left}>
      <div className={styles.brand}>
        <h1>Matrix CRM</h1>

        <p>
          Complete Business
          Management Platform
        </p>

        <ul>
          <li>
            ✓ Multi Company &
            Multi Branch
          </li>

          <li>
            ✓ CRM & Sales
          </li>

          <li>
            ✓ Project Management
          </li>

          <li>
            ✓ HR & Payroll
          </li>

          <li>
            ✓ Inventory &
            Procurement
          </li>

          <li>
            ✓ Finance &
            Accounting
          </li>

          <li>
            ✓ Reports &
            Analytics
          </li>

          <li>
            ✓ Role Based
            Permissions
          </li>

          <li>
            ✓ Secure OTP Login
          </li>
        </ul>

        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop:
              "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <p
            style={{
              marginBottom: 8,
              opacity: 0.9,
              fontSize: 14,
            }}
          >
            Empowering businesses with
            one unified platform.
          </p>

          <p
            style={{
              fontSize: 13,
              opacity: 0.75,
            }}
          >
            Version 1.0.0
          </p>

          <p
            style={{
              fontSize: 13,
              opacity: 0.75,
              marginTop: 4,
            }}
          >
            © 2026 Matrix IT Solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeft;