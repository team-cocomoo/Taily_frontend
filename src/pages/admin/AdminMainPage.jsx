import React from 'react';
import Users from '../../components/admin/Users';
import AdminFaqPage from './faq/AdminFaqPage';
import "../../styles/admin/Admin.css"; 
import { Route, Routes } from 'react-router-dom';
import AdminFaqDetailPage from './faq/AdminFaqDetailPage';
import AdminFaqWriteAndEditPgae from './faq/AdminFaqWriteAndEditPgae';
import AdminInquiryPage from './AdminInquiryPage';
import AdminReportPage from './AdminReportPage';

const AdminMainPage = () => {
    
    return (
        <Routes>
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<AdminReportPage />} />
            <Route path="inquiries" element={<AdminInquiryPage />} />
            <Route path='faqs/edit/:id' element={<AdminFaqWriteAndEditPgae />} />
            <Route path='faqs/write' element={<AdminFaqWriteAndEditPgae />} />
            <Route path="faqs/:id" element={<AdminFaqDetailPage />} />
            <Route path="faqs" element={<AdminFaqPage />} />
        </Routes>
        
    );
};

export default AdminMainPage;