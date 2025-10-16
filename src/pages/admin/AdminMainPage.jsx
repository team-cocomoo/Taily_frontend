import React from 'react';
import Users from '../../components/admin/Users';
import Reports from '../../components/admin/Reports';
import AdminFaqPage from './faq/AdminFaqPage';
import "../../styles/admin/Admin.css"; 
import { Route, Routes } from 'react-router-dom';
import AdminFaqDetailPage from './faq/AdminFaqDetailPage';
import AdminFaqWriteAndEditPgae from './faq/AdminFaqWriteAndEditPgae';

const AdminMainPage = () => {
    
    return (
        <Routes>
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path='faqs/edit/:id' element={<AdminFaqWriteAndEditPgae />} />
            <Route path='faqs/write' element={<AdminFaqWriteAndEditPgae />} />
            <Route path="faqs/:id" element={<AdminFaqDetailPage />} />
            <Route path="faqs" element={<AdminFaqPage />} />
            {/* 필요하면 notices, inquiries 등 추가 */}
        </Routes>
        
    );
};

export default AdminMainPage;