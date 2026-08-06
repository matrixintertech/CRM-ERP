import { useState } from "react";

import Header from "@/shared/components/layout/Header/Header";
import Sidebar from "@/shared/components/layout/Sidebar/Sidebar";
import Content from "@/shared/components/layout/Content/Content";

import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className={styles.body}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className={styles.content}>
          <Content />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
