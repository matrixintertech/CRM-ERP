import Header from "@/shared/components/layout/Header/Header";
import Sidebar from "@/shared/components/layout/Sidebar/Sidebar";
import Content from "@/shared/components/layout/Content/Content";

import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <Sidebar />

        <main className={styles.content}>
          <Content />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;