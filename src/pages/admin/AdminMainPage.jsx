import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AdminSidebar from "../../components/admin/AdminSidebar"; 
import Users from '../../components/admin/Users';

const AdminMainPage = () => {
    const [selectedMenu, setSelectedMenu] = useState(() => 'users'); // 기본 '회원 관리'
    console.log("selectedMenu:", selectedMenu);

    
    return (
        <div>
            <Row>
                <Col>
                    <div>Taily Admin Service</div>
                    <AdminSidebar
                        selectedMenu={selectedMenu}
                        setSelectedMenu={setSelectedMenu}
                    />    
                </Col>
                <Col>
                    <h1>관리자 테스트 페이지</h1>
                    {selectedMenu === 'users' && <Users />}
                    {/* {selectedMenu === 'notices' && <MyPetInfoCard setSelectedMenu={setSelectedMenu} />} */}
                
                </Col>
            </Row>
        </div>
    );
};

export default AdminMainPage;