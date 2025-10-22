// src/components/common/ProtectedLayout.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedLayout = ({ roles = [] }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // 로그인 페이지 구분 (admin인지 user인지)
  const isAdminPage = location.pathname.startsWith("/admin");
  const loginPath = isAdminPage ? "/admin/login" : "/login";

  if (!token) return <Navigate to={loginPath} replace />;

  try {
    const decoded = jwt_decode(token);
    const userRole = decoded.role;

    // 권한이 안 맞는 경우 (예: ROLE_USER가 /admin 접근)
    if (!roles.includes(userRole)) {
      console.warn(`권한 부족: ${userRole} → ${location.pathname}`);
      return <Navigate to={isAdminPage ? "/" : "/"} replace />;
    }

    return <Outlet />; // 통과 시 하위 페이지 렌더링
  } catch (err) {
    console.error("JWT 디코딩 실패:", err);
    return <Navigate to={loginPath} replace />;
  }
};

export default ProtectedLayout;
