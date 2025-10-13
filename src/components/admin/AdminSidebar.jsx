import React from 'react';
import { Nav } from 'react-bootstrap';

const navItems = [
    { key: 'user', lable: '회원 관리', active: true },
    { key: 'notices', lable: '공지사항 관리' },
    { key: 'faqs', lable: 'FAQ 관리' },
    { key: 'inquiries', lable: '1대1 문의 관리' },
    { key: 'events', lable: '이벤트 관리' },
]

const adminSidebar = ({ selectedMenu, setSelectedMenu }) => {
    return (
        <Nav className="flex-column">
            {navItems.map((item) => (
                <Nav.Link 
                    key={item.key}
                    onClick={() => setSelectedMenu(item.key)}
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

export default adminSidebar;