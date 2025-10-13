import React from 'react';
import { Nav } from 'react-bootstrap';

const navItems = [
    { key: 'users', label: '회원 관리' },
    { key: 'notices', label: '공지사항 관리' },
    { key: 'faqs', label: 'FAQ 관리' },
    { key: 'inquiries', label: '1대1 문의 관리' },
    { key: 'events', label: '이벤트 관리' },
]

const AdminSidebar = ({ selectedMenu, setSelectedMenu }) => {
    console.log("selectedMenu 현재값:", selectedMenu);

    return (
        <Nav className="flex-column">
            {navItems.map((item) => (
                <Nav.Link 
                    key={item.key}
                    onClick={() => setSelectedMenu(item.key)}
                    active={selectedMenu === item.key} // 명시적으로 active 제어
                    className={`p-2 my-1 rounded ${
                        selectedMenu === item.key ? 'bg-warning text-white fw-bold' : 'text-dark'
                    }`}
                    style={{ cursor: 'pointer' }}
                    >
                    {item.label}
                </Nav.Link>
            ))}
        </Nav>
    );
};

export default AdminSidebar;