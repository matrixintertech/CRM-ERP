import PageHeader from "@/shared/components/PageHeader";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

import DashboardCard from "../components/DashboardCard";

import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  useDocumentTitle("Dashboard");
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome to Matrix CRM" />

      <div className={styles.grid}>
        <DashboardCard title="Companies" value={15} />

        <DashboardCard title="Employees" value={248} />

        <DashboardCard title="Projects" value={42} />

        <DashboardCard title="Revenue" value="₹18.5L" />
      </div>
    </>
  );
};

export default DashboardPage;
