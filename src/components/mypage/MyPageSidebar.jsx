// src/components/mypage/MyPageSidebar.jsx
import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "@/styles/mypage/MyPageSidebar.css";

const MyPageSidebar = () => {
  const location = useLocation(); // 현재 경로 확인 (active 표시용)

  const menuItems = [
    { path: "/mypage/user", label: "마이페이지" },
    { path: "/mypage/pet", label: "내 반려동물" },
    { path: "/mypage/myfeed", label: "내 피드" },
    { path: "/mypage/like", label: "내 좋아요" },
    { path: "/mypage/follow-following", label: "내 팔로워/팔로잉" },
    { path: "/mypage/walk", label: "내 산책 경로 글" },
    { path: "/mypage/taily-friends", label: "내 테일리 프렌즈" },
    { path: "/mypage/inquiries", label: "내 1:1 문의 내역" },
  ];

  return (
    <div className="mypage-sidebar">
      <ListGroup>
        {menuItems.map((item) => (
          <ListGroup.Item
            as={Link}
            to={item.path}
            key={item.path}
            action
            active={location.pathname === item.path}
          >
            {item.label}
          </ListGroup.Item>
        ))}

      </ListGroup>
    </div>
  );
};

export default MyPageSidebar;
