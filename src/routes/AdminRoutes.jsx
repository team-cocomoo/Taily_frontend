// src/routes/AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedLayout from "@/components/common/ProtectedLayout";

// 관리자 페이지
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminMainPage from "@/pages/admin/AdminMainPage";
import AdminFaqPage from "@/pages/admin/faq/AdminFaqPage";
import AdminFaqDetailPage from "@/pages/admin/faq/AdminFaqDetailPage";
import AdminReportPage from "@/pages/admin/AdminReportPage";
import AdminInquiryPage from "@/pages/admin/AdminInquiryPage";
import AdminNoticeListPage from "@/pages/admin/notice/AdminNoticeListPage";
import AdminNoticeDetailPage from "@/pages/admin/notice/AdminNoticeDetailPage";
import AdminNoticeEditPage from "@/pages/admin/notice/AdminNoticeEditPage";
import AdminNoticeWritePage from "@/pages/admin/notice/AdminNoticeWritePage";
import Users from "@/components/admin/Users";

const AdminRoutes = (
  <Route path="admin" element={<AdminLayout />}>
    {/* 비회원 접근 가능 (로그인) */}
    <Route path="login" element={<AdminLoginPage />} />

    {/* ROLE_ADMIN 접근 필요 */}
    <Route element={<ProtectedLayout roles={["ROLE_ADMIN"]} />}>
      <Route path="main" element={<AdminMainPage />}>
        <Route path="users" element={<Users />} />
        <Route path="notices" element={<AdminNoticeListPage />} />
        <Route path="notices/:id" element={<AdminNoticeDetailPage />} />
        <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
        <Route path="notices/write" element={<AdminNoticeWritePage />} />
        <Route path="reports" element={<AdminReportPage />} />
        <Route path="inquiries" element={<AdminInquiryPage />} />
        <Route path="faqs" element={<AdminFaqPage />} />
        <Route path="faqs/:id" element={<AdminFaqDetailPage />} />
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;
