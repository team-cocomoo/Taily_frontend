// src/components/SidebarNav.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const navItems = [
    { key: 'me', label: '내정보', active: true }, 
    { key: 'my-pets', label: '내 반려 동물'}, 
    { key: 'my-feed', label: '내 피드' },
    { key: 'my-likes', label: '내 좋아요' },
    { key: 'follow', label: '내 팔로워/팔로잉' },
    { key: 'my-album', label: '내 산책 앨범' },
    { key: 'my-taily-friends', label: '내 테일리 프렌즈' },
    { key: 'qna', label: '내 1:1 문의 내역' },
];

const MyPageSidebarNav = ({ selectedMenu, setSelectedMenu }) => {
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

export default MyPageSidebarNav;