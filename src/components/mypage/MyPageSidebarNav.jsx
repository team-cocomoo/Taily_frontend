// src/components/MyPageSidebarNav.js
import React from 'react';
import { Nav } from 'react-bootstrap';

// 사이드바 메뉴 항목 정의
const navItems = [
    { key: 'my-pets', label: '내 반려 동물', active: true }, // 현재 페이지로 가정
    { key: 'my-feed', label: '내 피드' },
    { key: 'my-likes', label: '내 좋아요' },
    { key: 'follow', label: '내 팔로워/팔로잉' },
    { key: 'my-album', label: '내 산책 앨범' },
    { key: 'friends', label: '내 테일리 프렌즈' },
    { key: 'qna', label: '내 1:1 문의 내역' },
];

const MyPageSidebarNav = () => {
    return (
        <Nav className="flex-column">
            {navItems.map((item) => (
                <Nav.Link 
                    key={item.key}
                    href={`#${item.key}`}
                    className={`p-2 my-1 rounded ${item.active ? 'bg-warning text-white fw-bold' : 'text-dark'}`}
                    // 실제 구현 시, onSelect 등의 이벤트를 사용하여 메뉴 클릭 시 페이지 이동/상태 변경 로직을 추가합니다.
                >
                    {item.label}
                </Nav.Link>
            ))}
        </Nav>
    );
};

export default MyPageSidebarNav;