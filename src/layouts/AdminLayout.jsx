import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeaderbar from "@/components/admin/AdminHeaderbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "@/styles/layout/AdminLayout.css";

/**
 * AdminLayout
 * - 관리자 페이지 전체 레이아웃
 * - 로그인 페이지: 헤더만 + Outlet
 * - 나머지: 사이드바 + 메인
 */
const AdminLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  // 로그인 페이지일 경우: 사이드바 없이 Outlet만 표시
  if (isLoginPage) {
    return (
      <div className="admin-login-layout">
        <AdminHeaderbar />
        <main className="admin-login-main">
          <Outlet /> {/* 로그인 폼 표시 */}
        </main>
      </div>
    );
  }

  // 일반 관리자 페이지 레이아웃
  return (
    <div className="admin-layout">
      <div className="admin-content-wrapper">
        <AdminSidebar />
        <main className="admin-main">
          <Outlet /> {/* 관리자 실제 페이지 */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
