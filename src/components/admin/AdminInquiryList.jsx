import React, { useEffect, useState } from "react";
import { Card, Table, Pagination } from "react-bootstrap";
import api from "../../config/apiConfig";
import UserSearchBar from "./UserSearchBar";
import "../../styles/admin/AdminInquiryList.css";
import AdminInquiryModal from "./AdminInquiryModal";

const AdminInquiryList = () => {
  const [inquiryList, setInquiryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // 문의 리스트 조회
  const fetchInquiries = async (searchKeyword = "", page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ✅ 토큰 가져오기
      const params = { page, size: pageSize };
      if (searchKeyword.trim() !== "") params.keyword = searchKeyword.trim();

      const response = await api.get("/api/admin/inquiries", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ASK(질문)만 필터링
      const allInquiries =
        response.data.data.inquiries || response.data.data.content || [];

      const filtered = allInquiries.filter((inq) => inq.type === "ASK");

      setInquiryList(filtered);
      setTotalCount(filtered.length); // 전체 개수도 질문만 기준으로 표시
      setCurrentPage(page);
    } catch (error) {
      console.error("문의 리스트 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    fetchInquiries(searchKeyword, 1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => fetchInquiries(keyword, number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleInquiryClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInquiry(null);
  };

  if (loading) return <p>문의 리스트를 불러오는 중...</p>;

  return (
    <>
      <UserSearchBar value={keyword} onSearch={handleSearch} />

      <div className="inquiry-list">
        <Card
          className="p-3 w-100"
          style={{ minWidth: "800px", minHeight: "300px" }}
        >
          {inquiryList.length === 0 ? (
            <p className="text-center mb-0">등록된 문의가 없습니다.</p>
          ) : (
            <Table hover responsive className="inquiry-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "15%" }}>작성자</th>
                  <th style={{ width: "20%" }}>제목</th>
                  <th style={{ width: "30%" }}>내용</th>
                  <th style={{ width: "15%" }}>상태</th>
                  <th style={{ width: "15%" }}>작성일</th>
                </tr>
              </thead>
              <tbody>
                {inquiryList.map((inquiry, index) => (
                  <tr
                    key={inquiry.id || index}
                    onClick={() => handleInquiryClick(inquiry)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td className="truncate">{inquiry.nickname}</td>
                    <td className="truncate">{inquiry.title}</td>
                    <td className="truncate">{inquiry.content}</td>
                    <td>
                      {inquiry.state === "PENDING"
                        ? "답변 대기"
                        : inquiry.state === "RESOLVED"
                        ? "답변 완료"
                        : inquiry.state}
                    </td>
                    <td>
                      {new Date(inquiry.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <AdminInquiryModal
            show={showModal}
            handleClose={handleCloseModal}
            inquiry={selectedInquiry}
          />
          {totalPages >= 1 && inquiryList.length > 0 && (
            <Pagination className="justify-content-center mt-3">
              {paginationItems}
            </Pagination>
          )}
        </Card>
      </div>
    </>
  );
};

export default AdminInquiryList;
