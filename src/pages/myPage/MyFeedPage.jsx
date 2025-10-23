import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import api from "@/config/apiConfig";
import "@/styles/mypage/MyFeedPage.css";
import UserProfileImage from "@/components/mypage/UserProfileImage";
import MyPageSidebar from "@/components/mypage/MyPageSidebar";
import SecureImage from "@/components/common/SecureImage";

/**
 * MyFeedPage.jsx
 * 내가 작성한 피드의 이미지 목록을 JWT 인증 기반으로 표시
 */
const MyFeedPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [feedImages, setFeedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 유저 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/api/mypage/me");
        setUserInfo(res.data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };
    fetchUserInfo();
  }, []);

  // 내가 작성한 피드 이미지 목록 불러오기
  useEffect(() => {
    const fetchMyFeedImages = async () => {
      try {
        const res = await api.get("/api/images/my-feeds"); // JWT 자동 포함 (apiConfig)
        setFeedImages(res.data);
      } catch (err) {
        console.error("내 피드 이미지 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyFeedImages();
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
      {/* 상단 프로필 헤더 */}
      <UserProfileImage />
      {/* <h4 className="user-nickname">{userInfo?.nickname}</h4> */}

      {/* 본문 영역 */}
      <Container className="mypage-container">
        <Row>
          {/* 왼쪽 사이드바 */}
          <Col md={3}>
            <MyPageSidebar />
          </Col>

          {/* 오른쪽 내 피드 이미지 카드 */}
          <Col md={9}>
            <Card className="mypage-card">
              <Card.Body>
                <h5 className="mb-3 fw-bold">내가 작성한 피드</h5>

                {feedImages.length === 0 ? (
                  <p className="text-muted text-center mt-4">
                    아직 등록한 피드 이미지가 없습니다.
                  </p>
                ) : (
                  <div className="feed-image-grid">
                    {feedImages.map((img) => (
                      <div key={img.id} className="feed-image-item">
                        <SecureImage
                          src={img.filePath} // 예: /api/uploads/feed/xxxx.jpg
                          alt="피드 이미지"
                          className="feed-image"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyFeedPage;
