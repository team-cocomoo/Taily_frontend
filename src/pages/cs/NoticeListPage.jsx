import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import api from "@/config/apiConfig";
import SearchBar from "@/components/common/SearchBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PostListGroup from "@/components/board/PostListGroup"; // 공지 리스트 UI용
import WriteButton from "@/components/common/WriteButton"; // 관리자용 글쓰기 버튼

/**
 * 공지사항 목록 페이지
 * - 검색 + 페이지네이션 + 더보기 기능
 * - 일반 사용자도 조회 가능
 * - 관리자만 글쓰기 버튼 노출
 */
const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const size = 6; // 한 페이지 게시글 수

  const navigate = useNavigate();

  /** 🔹 공지 목록 불러오기 */
  const fetchNotices = async (pageNum = 0, search = "") => {
    try {
      setLoading(true);
      const res = await api.get("/api/notices", {
        params: { page: pageNum, size, keyword: search },
      });

      const data = res.data;
      const newNotices = data.content || [];

      if (pageNum === 0) {
        setNotices(newNotices);
      } else {
        setNotices((prev) => [...prev, ...newNotices]);
      }

      setHasMore(!data.last);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("공지 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 첫 로드 */
  useEffect(() => {
    fetchNotices(0);
  }, []);

  /** 🔹 검색 기능 */
  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setPage(0);
    fetchNotices(0, searchKeyword);
  };

  /** 🔹 더보기 버튼 */
  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchNotices(nextPage, keyword);
    setPage(nextPage);
  };

  /** 🔹 상세 페이지 이동 */
  const handleItemClick = (id) => {
    navigate(`/notices/${id}`);
  };

  /** 🔹 관리자 전용 글쓰기 버튼 표시 여부 */
  const isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";

  if (loading && page === 0) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>공지사항을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3" style={{ fontWeight: "bold" }}>
        공지사항
      </h2>

      {/* 검색창 */}
      <SearchBar value={keyword} onSearch={handleSearch} />

{/* 공지 리스트 */}
<div className="mt-4">
  {notices.length === 0 && !loading ? (
    <div className="text-center text-muted py-5">
      등록된 공지사항이 없습니다.
    </div>
  ) : (
    <PostListGroup items={notices} onItemClick={handleItemClick} />
  )}
</div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="text-center my-4">
          <Button onClick={handleLoadMore}>더보기</Button>
        </div>
      )}

      {/* 관리자만 글쓰기 버튼 표시 */}
      {isAdmin && (
        <WriteButton onClick={() => navigate("/admin/notices/write")} />
      )}
    </div>
  );
};

export default NoticeListPage;
