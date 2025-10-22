import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const AdminProtectedLayout = () => {
    const token = localStorage.getItem("token");


    if (!token) return <Navigate to="/admin/login" replace />;

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