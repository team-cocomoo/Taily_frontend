// src/components/mypage/MyPageSidebar.jsx
import React from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "@/styles/mypage/MyPageSidebar.css";

const MyPageSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="mypage-sidebar">
      <ListGroup>
        <ListGroup.Item action>마이페이지</ListGroup.Item>
        <ListGroup.Item action>내 반려동물</ListGroup.Item>
        <ListGroup.Item action>내 피드</ListGroup.Item>
        <ListGroup.Item action>내 좋아요</ListGroup.Item>
        <ListGroup.Item
          action
          onClick={() => navigate("/mypage/follow-following")}
        >
          내 팔로워/팔로잉
        </ListGroup.Item>
        <ListGroup.Item action>내 산책 경로 글</ListGroup.Item>
        <ListGroup.Item
          action
          onClick={() => navigate("/mypage/taily-friends")}
        >
          내 테일리 프렌즈
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/mypage/inquiries")}>
          내 1:1 문의 내역
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default MyPageSidebar;
