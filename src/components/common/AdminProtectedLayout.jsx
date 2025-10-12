import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const AdminProtectedLayout = ({ skipAuth = false }) => {
    const token = localStorage.getItem("token");

    if (skipAuth) {
        // 로그인 전 화면, Header/Footer 없음
        return <Outlet />;
    }

    if (!token) return <Navigate to="/admin/login" />;

    try {
        const decoded = jwt_decode(token);
        const userRoles = decoded.roles || [decoded.role];
        if (!userRoles.includes("ROLE_ADMIN")) return <Navigate to="/admin/login" />;

        return <Outlet />;
    } catch (err) {
        console.error("JWT 디코딩 실패:", err);
        return <Navigate to="/admin/login" />;
    }
};

export default AdminProtectedLayout;