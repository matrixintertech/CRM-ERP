import styles from "../styles/LoginPage.module.css";

const LoginLeft = () => {
  return (
    <div className={styles.left}>
      <div className={styles.brand}>
        <h1>Matrix CRM</h1>

        <p>
          Complete Business
          Management Software
        </p>

        <ul>
          <li>
            ✓ Multi Company
          </li>

          <li>
            ✓ Projects
          </li>

          <li>
            ✓ HR & Payroll
          </li>

          <li>
            ✓ Inventory
          </li>

          <li>
            ✓ Finance
          </li>

          <li>
            ✓ Reports
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginLeft;