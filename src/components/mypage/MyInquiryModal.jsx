// src/components/mypage/MyInquiryModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import api from "../../config/apiConfig";

const MyInquiryModal = ({ show, handleClose, inquiryId }) => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && inquiryId) {
      fetchInquiry(inquiryId);
    }
  }, [show, inquiryId]);

  // ✅ 문의 상세 + 답변 함께 조회
  const fetchInquiry = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/mypage/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success && response.data?.data) {
        setInquiry(response.data.data);
      } else {
        throw new Error("유효하지 않은 서버 응답");
      }
    } catch (error) {
      console.error("문의 상세 조회 실패:", error);
      setError("문의 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>문의 상세보기</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ✅ 로딩 상태 */}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : inquiry ? (
          <>
            {/* ✅ 문의 기본 정보 */}
            <div style={{ marginBottom: "10px" }}>
              <p>
                <strong>제목:</strong> {inquiry.title}
              </p>
              <p>
                <strong>작성일:</strong>{" "}
                {new Date(inquiry.createdAt).toLocaleDateString("ko-KR")}
              </p>
              <p>
                <strong>상태:</strong>{" "}
                {inquiry.state === "RESOLVED" ? "답변 완료" : "답변 대기"}
              </p>
            </div>
            <hr />

            {/* ✅ 문의 내용 */}
            <h5>문의 내용</h5>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "5px",
                whiteSpace: "pre-wrap",
                minHeight: "80px",
              }}
            >
              {inquiry.content}
            </div>

            <hr />

            {/* ✅ 관리자 답변 */}
            {inquiry.reply ? (
              <>
                <h5>관리자 답변</h5>
                <div
                  style={{
                    backgroundColor: "#f1f3f5",
                    padding: "10px",
                    borderRadius: "5px",
                    whiteSpace: "pre-wrap",
                    minHeight: "80px",
                  }}
                >
                  {inquiry.reply.content}
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#6c757d",
                  padding: "20px",
                  fontStyle: "italic",
                }}
              >
                답변 대기중입니다.
              </div>
            )}
          </>
        ) : (
          <p>문의 정보를 불러올 수 없습니다.</p>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-content-end">
        <Button variant="outline-primary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyInquiryModal;
