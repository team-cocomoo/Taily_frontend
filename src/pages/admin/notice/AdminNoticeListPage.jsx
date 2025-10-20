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
    return <p className="text-center mt-5">공지사항을 불러오는 중...</p>;

  return (
    <Card className="p-4 mt-4">
      {/* 상단 헤더: 제목 + 글쓰기 버튼 */}
      <Row className="align-items-center mb-3">
        <Col>
          <h4 style={{ fontWeight: "bold" }}>공지사항 관리</h4>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={handleWriteClick}>
            글쓰기
          </Button>
        </Col>
      </Row>

      {/* 검색창 */}
      <InputGroup className="my-3">
        <Form.Control
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button variant="primary" onClick={handleSearch}>
          검색
        </Button>
      </InputGroup>

      {/* 공지 테이블 */}
      <Table hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {notices.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          ) : (
            notices.map((notice, idx) => (
              <tr
                key={notice.id || idx}
                onClick={() => navigate(`/admin/main/notices/${notice.id}`)}
                style={{
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "")
                }
              >
                <td>{pageSize * currentPage + idx + 1}</td>
                <td>{notice.title}</td>
                <td>{notice.authorName || "관리자"}</td>
                <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                <td>{notice.viewCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

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
