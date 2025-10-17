// pages/feed/FeedMainPage.jsx
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import FeedCard from "@/components/feed/FeedCard";
import api from "@/config/apiConfig";
import nofeed from "@/assets/image/nofeed.png";
import WriteButton from "../../components/common/WriteButton";
import "@/styles/feed/FeedMainPage.css"; // ✅ 스타일 추가

export default function FeedMainPage() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="feed-page-container">
      {feeds.length > 0 ? (
        feeds.map((feed) => (
          <FeedCard key={feed.id} feedData={feed} onUpdate={handleUpdateFeed} />
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

      <div className="text-center mt-5 mb-5">
        <WriteButton
          onClick={() => (window.location.href = "/petstory/feed/write")}
        />
      </div>
    </div>
  );
}
