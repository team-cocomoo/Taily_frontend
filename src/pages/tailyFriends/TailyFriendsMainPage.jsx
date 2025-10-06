import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCardGroup from "../../components/board/PostCardGroup";
import SearchBar from "../../components/common/SearchBar";
import WriteButton from "../../components/common/WriteButton";
import { useNavigate } from "react-router-dom";

const TailyFriendsMainPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // localStorage에서 JWT 토큰 가져오기
        const token = localStorage.getItem("accessToken");

        const response = await axios.get("/api/taily-friends", {
          params: { page: 1, size: 6 },
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        
        // 안전하게 data 접근
        const postsData = response.data?.data || [];
        setPosts(postsData);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/taily-friends/${id}`);
  };

  return (
    <div className="mt-4" style={{ paddingTop: "160px" }}>
      <h2 className="page-title">테일리 프렌즈 게시판</h2>
      <SearchBar />
      <br />
      <PostCardGroup items={posts} onItemClick={handleItemClick} />
      <WriteButton />
    </div>
  );
};

export default TailyFriendsMainPage;
