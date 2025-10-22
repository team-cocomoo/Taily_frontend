import { useState, useCallback, useEffect } from "react";
import { getFeeds } from "@/api/feedService"; // axios 호출 함수

/**
 * 데이터/상태 관리 훅
 * React 상태 관리 전담
 * API 호출(feedService) + 상태 업데이트 (feeds, loading, hasNext) 포함
 * UI와 로직 분리 -> 컴포넌트는 상태와 호출 함수만 사용
 * 피드 로직을 불러오고 관리하는 로직 캡슐화함
 * @param {} pageSize
 * @returns
 */
export const useFeeds = (pageSize = 10) => {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState(null);

  const loadFeeds = useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);

    try {
      const res = await getFeeds(page, pageSize);
      const data = res.data;

      const newFeeds = Array.isArray(data.content) ? data.content : [];
      setFeeds((prev) => [...prev, ...newFeeds]);

      setHasNext(!data.last);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("피드 로드 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, hasNext, loading]);

  // 초기 로드
  useEffect(() => {
    loadFeeds();
  }, []);

  return { feeds, loading, hasNext, error, loadFeeds };
};
