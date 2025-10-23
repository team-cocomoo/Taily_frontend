import React, { useEffect, useState } from "react";
import api from "@/config/apiConfig";
import {
  Card,
  Table,
  Pagination,
  Form,
  InputGroup,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "@/styles/admin/AdminNotice.css";

const AdminNoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  /** 공지 목록 불러오기 */
  const fetchNotices = async (searchKeyword = "", page = 0) => {
    setLoading(true);
    try {
      const params = { page, size: pageSize };
      if (searchKeyword.trim()) params.keyword = searchKeyword.trim();
      const res = await api.get("/api/notices", { params });
      const data = res.data;

      setNotices(data.content || []);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err) {
      console.error("공지 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 검색 */
  const handleSearch = () => {
    fetchNotices(keyword, 0);
  };

  /** 페이지 변경 */
  const handlePageChange = (pageNum) => {
    if (pageNum < 0 || pageNum >= totalPages) return;
    fetchNotices(keyword, pageNum);
  };

  /** 글쓰기 페이지 이동 */
  const handleWriteClick = () => {
    navigate("/admin/main/notices/write");
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading)
    return <p className="admin-notice-loading">공지사항을 불러오는 중...</p>;

  return (
    <Card className="admin-notice-container">
      {/* 헤더 */}
      <div className="admin-notice-header">
        <h4 className="admin-notice-title">공지사항 관리</h4>
        <Button
          variant="success"
          onClick={handleWriteClick}
          className="admin-notice-write-btn"
        >
          글쓰기
        </Button>
      </div>

      {/* 검색창 */}
      <InputGroup className="admin-notice-search">
        <Form.Control
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button variant="primary admin-notice-searchbutton" onClick={handleSearch}>
          검색
        </Button>
      </InputGroup>

      {/* 공지 테이블 */}
      <div className="admin-notice-table-wrapper">
        <Table hover responsive className="admin-notice-table">
          <thead>
            <tr>
              <th style={{ width: "8%" }}>#</th>
              <th>제목</th>
              <th style={{ width: "18%" }}>작성일</th>
              <th style={{ width: "15%" }}>작성자</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              notices.map((notice, idx) => (
                <tr
                  key={notice.id || idx}
                  onClick={() => navigate(`/admin/main/notices/${notice.id}`)}
                >
                  <td>{pageSize * currentPage + idx + 1}</td>
                  <td className="admin-notice-title-cell">{notice.title}</td>
                  <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                  <td>{notice.authorName || "admin"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          />
        </Pagination>
      )}
    </Card>
  );
};

export default AdminNoticeListPage;
