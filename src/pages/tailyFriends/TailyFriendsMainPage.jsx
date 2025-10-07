import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCardGroup from "../../components/board/PostCardGroup";
import SearchBar from "../../components/common/SearchBar";
import WriteButton from "../../components/common/WriteButton";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const TailyFriendsMainPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/taily-friends", {
          params: { page: 1, size: 6 },
        });

        // response.data.data 구조 확인
        setPosts(response.data?.data || []);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/taily-friends/${id}`);
  };

  if (loading) {
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
      <WriteButton onClick={() => navigate("/taily-friends/write")} />
    </div>
  );
};

export default TailyFriendsMainPage;
