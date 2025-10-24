import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCardGroup from "../../components/board/PostCardGroup";
import SearchBar from "../../components/common/SearchBar";
import WriteButton from "../../components/common/WriteButton";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Button } from "react-bootstrap";
import TailyFriendsMainMap from "../../components/board/tailyfriends/TailyFriendsMainMap";

const TailyFriendsMainPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const size = 6;

  const fetchPosts = async (pageNum = 1, keyword = null) => {
    try {
      setLoading(true);
      const response = await api.get("/api/taily-friends", {
        params: { page: pageNum, size, keyword },
      });

      const data = response.data?.data?.data || [];
      const total = response.data?.data?.totalCount || 0;

      if (pageNum === 1) setPosts(data);
      else setPosts((prev) => [...prev, ...data]);

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

  const handleSearch = (keyword) => {
    setPage(1);
    fetchPosts(1, keyword);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchPosts(nextPage);
    setPage(nextPage);
  };

  return (
    <div className="mt-4">
      <TailyFriendsMainMap />
      <SearchBar
        placeholder="제목, 내용, 작성자 검색"
        onSearch={handleSearch}
      />
      <br />
      {loading && page === 1 ? (
        <div className="text-center mt-5">
          <LoadingSpinner />
          <div>로딩 중...</div>
        </div>
      ) : (
        <>
          <PostCardGroup
            items={posts}
            onItemClick={(id) => navigate(`/taily-friends/${id}`)}
          />
          {hasMore && (
            <div className="text-center my-4">
              <Button onClick={handleLoadMore}>더보기</Button>
            </div>
          )}
          <WriteButton onClick={() => navigate("/taily-friends/write")} />
        </>
      )}
    </div>
  );
};

export default TailyFriendsMainPage;
