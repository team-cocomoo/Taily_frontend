import React, { useEffect, useState } from "react";
import { Table, Spinner, Pagination } from "react-bootstrap";
import MyInquiryModal from "./MyInquiryModal";
import api from "../../config/apiConfig";

const MyInquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const fetchMyInquiries = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(
          `/api/mypage/inquiries?page=${page}&size=${pageSize}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data.data;
        setInquiries(data.inquiries || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("내 문의 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyInquiries();
  }, [page]);

  const handleRowClick = (id) => {
    setSelectedInquiryId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInquiryId(null);
  };

  const renderPagination = () => (
    <div className="d-flex justify-content-center mt-4">
      <Pagination className="custom-pagination">
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        />
        {Array.from({ length: totalPages }, (_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={page === idx + 1}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        />
      </Pagination>
    </div>
  );

  if (loading) return <Spinner animation="border" />;
  if (!inquiries.length) return <p>작성한 문의가 없습니다.</p>;

  return (
    <>
      <Table borderless hover responsive className="text-center my-taily-table">
        <thead className="table">
          <tr className="my-taily-friends-tr">
            <th style={{ width: "10%" }}>번호</th>
            <th style={{ width: "20%" }}>제목</th>
            <th style={{ width: "35%" }}>내용</th>
            <th style={{ width: "15%" }}>상태</th>
            <th style={{ width: "20%" }}>작성일</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq, index) => (
            <tr
              key={inq.id}
              onClick={() => handleRowClick(inq.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{(page - 1) * pageSize + index + 1}</td>
              <td>{inq.title}</td>
              <td>{inq.content}</td>
              <td>{inq.state === "RESOLVED" ? "답변완료" : "대기중"}</td>
              <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {renderPagination()}

      <MyInquiryModal
        show={showModal}
        handleClose={handleCloseModal}
        inquiryId={selectedInquiryId}
      />
    </>
  );
};

export default MyInquiryList;
