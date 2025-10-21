import React, { useState, useEffect } from "react";
import PostListGroup from "../../components/board/PostListGroup";
import SearchBar from "../../components/common/SearchBar";
import WriteButton from "../../components/common/WriteButton";
import { useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Button } from "react-bootstrap";
import BaseMapInput from "../../components/common/Basemap";

const WalkPathMainPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false); // 더보기 버튼 표시
  const [totalCount, setTotalCount] = useState(0); // 전체 게시글 수
  const size = 6; // 한 페이지 게시글 수

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get("http://localhost:8080/api/walk-paths", {
        params: { page: pageNum, size },
      });

      console.log("API 응답:", response.data);
      console.log("게시글 목록:", response.data?.data);

      // 백엔드에서 totalCount와 data를 같이 내려줌
      const data = response.data?.data || [];
      const total = Array.isArray(data) ? data.length : 0;

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

  //추가 검색 기능
  const handleSearch = async (keyword) => {
    console.log("검색어:", keyword);
    if (!keyword.trim()) {
      // ⭐ [변경] 검색어가 없으면 전체 목록으로 복귀
      fetchPosts(1);
      return;
    }

    try {
      setLoading(true);
      // 검색 API 호출
      const response = await api.get(
        "http://localhost:8080/api/walk-paths/search",
        {
          params: { keyword, page: 0, size },
        }
      );

      console.log("검색 결과:", response.data);
      const data = response.data?.data || [];
      setPosts(data);
      setHasMore(false); // 검색 시 더보기 비활성화
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  // 상세 페이지로 이동하는 함수
  const handleItemClick = (id) => {
    navigate(`/walk-paths/${id}`);
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
    <div className="container mt-4">
      <h2>산책 경로 게시판</h2>
      {/* 지도 모듈 표시 */}
      <BaseMapInput />
      <br />
      {/* 검색창 출력 */}
      <SearchBar onSearch={handleSearch}/>
      <br />
      {/* 게시물을 리스트 형식으로 출력 */}
      <PostListGroup items={posts} onItemClick={handleItemClick} />

      {hasMore && (
        <div className="text-center my-4">
          <Button onClick={handleLoadMore}>더보기</Button>
        </div>
      )}
      {/* 발자국 버튼 - 작성 페이지로 연결 */}
      
      <WriteButton onClick={() => navigate("/walk-paths/write")} />
    </div>
  );
};

export default WalkPathMainPage;
