import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AdminSidebar from "../../components/admin/AdminSidebar"; 
import Users from '../../components/admin/Users';
import Reports from '../../components/admin/Reports';
import AdminFaqPage from './faq/AdminFaqPage';
import "../../styles/admin/Admin.css"; 
import { Route } from 'react-router-dom';
import AdminFaqDetailPage from './faq/AdminFaqDetailPage';

const AdminMainPage = () => {
    const [selectedMenu, setSelectedMenu] = useState(() => 'users');
    const [selectedFaqId, setSelectedFaqId] = useState(null);

    
    return (
        <div>
            <Row>
                <Col xs={2} className="p-0">
                <div className='sidebar-logo text-center py-3 fw-bold'>
                    Taily Admin Service
                </div>
                <AdminSidebar
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                />
            </Col>
                <Col xs={10} className="p-4">
                    {selectedMenu === 'users' && <Users />}
                    {selectedMenu === 'reports' && <Reports />}
                    {selectedMenu === 'faqs' && (
                        selectedFaqId
                            ? <AdminFaqDetailPage id={selectedFaqId} onBack={() => setSelectedFaqId(null)} />
                            : <AdminFaqPage onSelectFaq={(id) => setSelectedFaqId(id)} />
                    )}
                    {/* {selectedMenu === 'notices' && <MyPetInfoCard setSelectedMenu={setSelectedMenu} />} */}
                
                </Col>
            </Row>
        </div>
    );
};

export default AdminMainPage;