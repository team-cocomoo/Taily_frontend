import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFeeds } from "@/hook/useFeeds";
import FeedCard from "../../components/feed/FeedCard.jsx";
import WriteButton from "../../components/common/WriteButton.jsx";
import nofeed from "../../assets/image/nofeed.png";

const FeedMainPage = () => {
  const { feeds, loading, hasNext, loadFeeds } = useFeeds(10);
  const observer = useRef();
  const navigate = useNavigate();

  const lastFeedRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          loadFeeds();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasNext, loadFeeds]
  );

  // 버튼 클릭 시 이동할 함수
  const handleWriteClick = () => {
    navigate("/petstory/feed/write"); // 피드 작성 페이지로 이동
  };

  return (
    <div className="feed-list">
      {feeds.length === 0 && !loading && (
        <div style={{textAlign: "center",margin:"50px"}}>
        <img src={nofeed} alt="등록된 피드 없음" style={{width: "200px", height : "auto", opacity : 0.8, marginBottom: "20px"}} />

        <p className="text-center">"피드를 등록하고 우리 아이의 멋진 이야기를 시작해 주세요."</p>
        </div>
      )}

      {feeds.map((feed, index) => {
        if (index === feeds.length - 1) {
          return <FeedCard key={feed.id} feed={feed} ref={lastFeedRef} />;
        } else {
          return <FeedCard key={feed.id} feed={feed} />;
        }
      })}

      {loading && <p>로딩 중...</p>}
      {!hasNext && <p>더 이상 피드가 없습니다.</p>}

      <WriteButton onClick={handleWriteClick} />
    </div>
  );
};

export default FeedMainPage;
