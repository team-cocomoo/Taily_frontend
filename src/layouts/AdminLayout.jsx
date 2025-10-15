import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeaderbar from "../components/admin/AdminHeaderbar";
import "../styles/layout/AdminLayout.css"

// import "../styles/admin.css"; // 선택

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminHeaderbar />
      <main className="container py-4 admin-container">
        <Outlet /> {/* 여기서 하위 라우트 렌더링 */}
      </main>
    </div>
  );
};

export default AdminLayout;