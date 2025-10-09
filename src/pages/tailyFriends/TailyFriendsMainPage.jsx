import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCardGroup from "../../components/board/PostCardGroup";
import SearchBar from "../../components/common/SearchBar";
import WriteButton from "../../components/common/WriteButton";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Button } from "react-bootstrap";

const TailyFriendsMainPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false); // 더보기 버튼 표시 여부
  const [totalCount, setTotalCount] = useState(0); // 전체 게시글 수
  const size = 6; // 한 페이지 게시글 수

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get("/api/taily-friends", {
        params: { page: pageNum, size },
      });

      // 백엔드에서 totalCount와 data를 같이 내려줌
      const data = response.data?.data?.data || [];
      const total = response.data?.data?.totalCount || 0;

      if (pageNum === 1) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }

      setTotalCount(total);
      setHasMore((pageNum - 1) * size + data.length < total);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleItemClick = (id) => {
    navigate(`/taily-friends/${id}`);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchPosts(nextPage);
    setPage(nextPage);
  };

  if (loading && page === 1) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mt-4" style={{ paddingTop: "160px" }}>
      <h2 className="page-title">테일리 프렌즈 게시판</h2>
      <SearchBar />
      <br />
      <PostCardGroup items={posts} onItemClick={handleItemClick} />

      {hasMore && (
        <div className="text-center my-4">
          <Button onClick={handleLoadMore}>더보기</Button>
        </div>
      )}

      <WriteButton onClick={() => navigate("/taily-friends/write")} />
    </div>
  );
};

export default TailyFriendsMainPage;
