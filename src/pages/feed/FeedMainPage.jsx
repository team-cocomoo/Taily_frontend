import React, { useEffect, useState, useRef, useCallback } from "react";
import { getFeeds } from "../../api/FeedService.js";
import FeedCard from "../../components/feed/FeedCard.jsx";

const FeedMainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const size = 10; // 페이지당 피드 수

  useEffect(() => {
    loadFeeds(page);
  }, [page]);

  const loadFeeds = async (pageNum) => {
    try {
      const res = await getFeeds(pageNum, size);
      const newFeeds = res.data.content;

      setFeeds((prev) => [...prev, ...newFeeds]);
      if (newFeeds.length < size) setHasMore(false); // 마지막 페이지 도달
    } catch (err) {
      console.error("피드 불러오기 실패:", err);
    }
  };

  // 무한 스크롤 IntersectionObserver
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleLikeToggle = (feedId, liked) => {
    // 필요한 경우 feeds 상태 업데이트 가능
    setFeeds((prev) =>
      prev.map((f) => (f.id === feedId ? { ...f, liked } : f))
    );
  };

  return (
    <div className="container my-4">
      {feeds.map((feed) => (
        <FeedCard key={feed.id} feed={feed} onLikeToggle={handleLikeToggle} />
      ))}
      {hasMore && (
        <div ref={loaderRef} className="text-center py-3">
          🔄 로딩 중...
        </div>
      )}
      {!hasMore && (
        <div className="text-center py-3">모든 피드를 불러왔습니다.</div>
      )}
    </div>
  );
};

export default FeedMainPage;
