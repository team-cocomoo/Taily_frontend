import React from 'react';
import AdminFaqList from '../../../components/admin/AdminFaqList';
import { Container } from 'react-bootstrap';

const AdminFaqPage = () => {
    return (
        <Container style={{ marginTop: "120px" }}>
            <div className="mt-5 p-4">
                <h4 style={{fontWeight:"bold"}}>FAQ</h4>
            </div>
            <AdminFaqList />
        </Container>
    );
};

export default AdminFaqPage;