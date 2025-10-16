import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeaderbar from "../components/admin/AdminHeaderbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../styles/layout/AdminLayout.css";

const AdminLayout = () => {
  const location = useLocation();

  // 로그인 페이지인지 확인
  const isLoginPage = location.pathname === "/admin/login";

  return (
    <div className="admin-layout">
      {isLoginPage && <AdminHeaderbar />}
      <div className="admin-content-wrapper">
        {!isLoginPage && <AdminSidebar />}
        <main className="admin-main">
          <Outlet /> {/* 하위 실제 페이지 라우트 렌더링 */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
