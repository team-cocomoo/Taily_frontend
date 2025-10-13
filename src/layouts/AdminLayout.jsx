import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar"; 
// import "../styles/admin.css"; // 선택

const AdminLayout = () => {
  return (
    <div className="d-flex admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet /> {/* 여기서 하위 라우트 렌더링 */}
      </div>
    </div>
  );
};

export default AdminLayout;