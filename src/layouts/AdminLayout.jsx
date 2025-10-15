import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeaderbar from "../components/admin/AdminHeaderbar";
import "../styles/layout/AdminLayout.css";

const AdminLayout = () => {
  const location = useLocation();

  // 로그인 페이지인지 확인
  const isLoginPage = location.pathname === "/admin/login";

  return (
    <div className="admin-layout">
      {isLoginPage && <AdminHeaderbar />}
      <main className="container admin-container">
        <Outlet /> {/* 하위 라우트 렌더링 */}
      </main>
    </div>
  );
};

export default AdminLayout;
