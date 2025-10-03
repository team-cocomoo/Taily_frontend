import React, { useState, useEffect } from "react";
import PostListGroup from "../../components/board/PostListGroup";
import SearchBar from "../../components/common/SearchBar";
import WriteButton from "../../components/common/WriteButton";
import { useNavigate } from "react-router-dom"; 

const WalkPathMainPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    // 여기는 나중에 API로 바뀔 부분
    const mockPosts = [
      {
        id: 1,
        title: "여기 좋아요",
        author: "작성자",
        views: 17,
        date: "2025/09/22",
      },
      {
        id: 2,
        title: "강아지가 좋아해요",
        author: "작성자",
        views: 30,
        date: "2025/09/21",
      },
      {
        id: 3,
        title: "강아지가 좋아해요",
        author: "작성자",
        views: 30,
        date: "2025/09/21",
      },
      {
        id: 4,
        title: "강아지가 좋아해요",
        author: "작성자",
        views: 30,
        date: "2025/09/21",
      },
      {
        id: 5,
        title: "강아지가 좋아해요",
        author: "작성자",
        views: 30,
        date: "2025/09/21",
      },
      {
        id: 6,
        title: "강아지가 좋아해요",
        author: "작성자",
        views: 30,
        date: "2025/09/21",
      },
      {
        id: 7,
        title: "강아지가 좋아해요",
        author: "작성자",
        views: 30,
        date: "2025/09/21",
      },
      {
        id: 8,
        title: "강아지가 좋아해요",
        author: "작성자",
        views: 30,
        date: "2025/09/21",
      },
    ];
    setPosts(mockPosts);
  }, []);

  // ✅ 상세 페이지로 이동하는 함수
  const handleItemClick = (id) => {
    navigate(`/walkpath/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>산책 경로 게시판</h2>
      {/* 검색창 출력 */}
      <SearchBar />
      <br />
      {/* 게시물을 리스트 형식으로 출력 */}
      <PostListGroup items={posts} onItemClick={handleItemClick} />
      {/* 발자국 버튼 - 작성 페이지로 연결 */}
      <WriteButton />
    </div>
  );
};

export default WalkPathMainPage;
