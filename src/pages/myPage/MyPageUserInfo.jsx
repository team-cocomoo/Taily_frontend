// src/pages/mypage/MyPageUserInfo.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import api from "@/config/apiConfig";
import "@/styles/myPage/MyPageUserInfo.css";
import '@/styles/myPage/myLikes.css';
import UserProfileImage from "@/components/mypage/UserProfileImage";
import MyPageSidebar from "@/components/mypage/MyPageSidebar";
import UserInfoSection from "@/components/mypage/UserInfoSection";

const MyPageUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await api.get("/api/mypage/me");
        setUserInfo(res.data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyInfo();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="mypage-wrapper">

      {/* 상단 프로필 헤더 (이미지 + 닉네임) */}
      <UserProfileImage />
      {/* <h4 className="user-nickname">{userInfo?.nickname}</h4> */}

      {/* 본문 영역 */}
      <Container className="mypage-container">
        <Row>
          {/* 왼쪽 사이드 메뉴 */}
          <Col md={3}>
            <MyPageSidebar />
          </Col>

          {/* 오른쪽 내 정보 카드 */}
          <Col md={9}>
            <Card className="mypage-card">
              <UserInfoSection userInfo={userInfo} />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPageUserInfo;
