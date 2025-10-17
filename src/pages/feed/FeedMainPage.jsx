// pages/feed/FeedMainPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import FeedCard from "@/components/feed/FeedCard";
import api from "@/config/apiConfig";
import nofeed from "@/assets/image/nofeed.png";
import WriteButton from "../../components/common/WriteButton";

export default function FeedMainPage() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 피드 데이터 불러오기
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await api.get("/api/feeds");
        setFeeds(res.data.content);
      } catch (err) {
        console.error("피드 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  // 좋아요 등 상태 변경 시 feed 업데이트
  const handleUpdateFeed = (id, updatedFeed) => {
    setFeeds((prev) => prev.map((f) => (f.id === id ? updatedFeed : f)));
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        {feeds.length > 0 ? (
          feeds.map((feed) => (
            <Col md={6} key={feed.id}>
              <FeedCard feedData={feed} onUpdate={handleUpdateFeed} />
            </Col>
          ))
        ) : (
          <div className="text-center mt-5">
            <img
              src={nofeed}
              alt="등록된 피드 없음"
              style={{ width: "200px", opacity: 0.7 }}
            />
            <p className="text-muted mt-3">아직 등록된 피드가 없습니다.</p>
          </div>
        )}
      </Row>

      {/* 글쓰기 버튼 */}
      <div className="text-center mt-5 mb-5">
        <WriteButton
          onClick={() => (window.location.href = "/petstory/feed/write")}
        />
      </div>
    </Container>
  );
}
