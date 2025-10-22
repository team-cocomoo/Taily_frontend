// src/routes/AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AdminProtectedLayout from "@/components/common/AdminProtectedLayout";

// 관리자 페이지
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminMainPage from "@/pages/admin/AdminMainPage";
import AdminUsersPage from "@/pages/admin/users/AdminUsersPage";
import AdminFaqPage from "@/pages/admin/faq/AdminFaqPage";
import AdminFaqDetailPage from "@/pages/admin/faq/AdminFaqDetailPage";
import AdminFaqWriteAndEditPage from "@/pages/admin/faq/AdminFaqWriteAndEditPgae";
import AdminReportPage from "@/pages/admin/AdminReportPage";
import AdminInquiryPage from "@/pages/admin/AdminInquiryPage";
import AdminNoticeListPage from "@/pages/admin/notice/AdminNoticeListPage";
import AdminNoticeDetailPage from "@/pages/admin/notice/AdminNoticeDetailPage";
import AdminNoticeEditPage from "@/pages/admin/notice/AdminNoticeEditPage";
import AdminNoticeWritePage from "@/pages/admin/notice/AdminNoticeWritePage";

const AdminRoutes = (
  <Route path="admin" element={<AdminLayout />}>
    {/* 비회원 접근 가능 (로그인) */}
    <Route path="login" element={<AdminLoginPage />} />

    {/* ROLE_ADMIN 접근 필요 */}
    <Route element={<AdminProtectedLayout roles={["ROLE_ADMIN"]} />}>
      <Route path="main/*" element={<AdminMainPage />}>
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="notices" element={<AdminNoticeListPage />} />
        <Route path="notices/:id" element={<AdminNoticeDetailPage />} />
        <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
        <Route path="notices/write" element={<AdminNoticeWritePage />} />
        <Route path="reports" element={<AdminReportPage />} />
        <Route path="inquiries" element={<AdminInquiryPage />} />
        <Route path="faqs" element={<AdminFaqPage />} />
        <Route path="faqs/:id" element={<AdminFaqDetailPage />} />
        <Route path="faqs/write" element={<AdminFaqWriteAndEditPage />} />
        <Route path="faqs/edit/:id" element={<AdminFaqWriteAndEditPage />} />

      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;
