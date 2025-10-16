import React, { useRef, useCallback } from "react";
import { useFeeds } from "@/hook/useFeeds";
import FeedCard from "../../components/feed/FeedCard.jsx";

const FeedMainPage = () => {
  const { feeds, loading, hasNext, loadFeeds } = useFeeds(10);
  const observer = useRef();

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

  return (
    <div className="feed-list">
      {feeds.length === 0 && !loading && (
        <p className="text-center">등록된 피드가 없습니다.</p>
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
    </div>
  );
};

export default FeedMainPage;
