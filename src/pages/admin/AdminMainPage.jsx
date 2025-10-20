import React from "react";
import AdminFaqPage from "./faq/AdminFaqPage";
import "../../styles/admin/Admin.css";
import { Route, Routes } from "react-router-dom";
import AdminFaqDetailPage from "./faq/AdminFaqDetailPage";
import AdminFaqWriteAndEditPgae from "./faq/AdminFaqWriteAndEditPgae";
import AdminInquiryPage from "./AdminInquiryPage";
import AdminReportPage from "./AdminReportPage";
import AdminNoticeListPage from "./notice/AdminNoticeListPage";
import AdminNoticeDetailPage from "./notice/AdminNoticeDetailPage";
import AdminNoticeEditPage from "./notice/AdminNoticeEditPage";
import AdminNoticeWritePage from "./notice/AdminNoticeWritePage";
import AdminUsersPage from "./users/AdminUsersPage";

const AdminMainPage = () => {
  return (
    <Routes>
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="notices" element={<AdminNoticeListPage />} />
      <Route path="notices/:id" element={<AdminNoticeDetailPage />} />
      <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
      <Route path="notices/write" element={<AdminNoticeWritePage />} />
      <Route path="reports" element={<AdminReportPage />} />
      <Route path="inquiries" element={<AdminInquiryPage />} />
      <Route path="faqs/edit/:id" element={<AdminFaqWriteAndEditPgae />} />
      <Route path="faqs/write" element={<AdminFaqWriteAndEditPgae />} />
      <Route path="faqs/:id" element={<AdminFaqDetailPage />} />
      <Route path="faqs" element={<AdminFaqPage />} />
    </Routes>
  );
};

export default AdminMainPage;
