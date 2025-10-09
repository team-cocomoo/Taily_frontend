// src/components/common/ProtectedLayout.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedLayout = ({ roles = [] }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwt_decode(token);
    const userRole = decoded.role; // JWT에 role 클레임 포함되어 있어야 함

    if (!roles.includes(userRole)) return <Navigate to="/" />;

    return <Outlet />; // 권한 있음 → 자식 컴포넌트 렌더링
  } catch (err) {
    console.error("JWT 디코딩 실패:", err);
    return <Navigate to="/login" />;
  }
};

export default ProtectedLayout;
