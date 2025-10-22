import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../config/apiConfig";

const AdminInquiryModal = ({ show, handleClose, inquiry }) => {
  const [replyContent, setReplyContent] = useState("");
  const [reply, setReply] = useState(null); // 이미 등록된 답변
  const [loading, setLoading] = useState(false);

  // 문의가 선택될 때마다 답변 존재 여부 확인
  useEffect(() => {
    if (inquiry && inquiry.id) {
      fetchReply(inquiry.id);
    }
  }, [inquiry]);

  // 이미 등록된 답변 조회
  const fetchReply = async (parentId) => {
    try {
      const response = await api.get(`/api/admin/inquiries/${parentId}/reply`);
      setReply(response.data.data); // InquiryResponseDto 형태
    } catch (error) {
      // 404면 답변이 없는 경우
      setReply(null);
    }
  };

  // 답변 등록
  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const dto = {
        title: `RE: ${inquiry.title}`,
        content: replyContent,
        parentId: inquiry.id, // 부모 문의 ID
      };

      await api.post("/api/inquiries", dto);

      alert("답변이 등록되었습니다.");
      handleClose();
    } catch (error) {
      console.error("답변 등록 실패:", error);
      alert("답변 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!inquiry) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>문의 상세보기</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "1rem" }}>
        {/* 문의 정보 */}
        <div style={{ marginBottom: "10px" }}>
          <p>
            <strong>문의자:</strong> {inquiry.nickname}
          </p>
          <p>
            <strong>생성일:</strong>{" "}
            {new Date(inquiry.createdAt).toLocaleDateString("ko-KR")}
          </p>
          <p>
            <strong>상태:</strong>{" "}
            {inquiry.state === "PENDING" ? "답변 대기" : "답변 완료"}
          </p>
        </div>
        <hr />

        {/* 문의 내용 */}
        <div style={{ marginBottom: "20px" }}>
          <h5 style={{ fontWeight: "bold" }}>문의 내용</h5>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "10px",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
              minHeight: "100px",
            }}
          >
            {inquiry.content}
          </div>
        </div>

        {/* 답변 영역 */}
        {reply ? (
          <>
            <hr />
            <h5 style={{ fontWeight: "bold" }}>관리자 답변</h5>
            <div
              style={{
                backgroundColor: "#f1f3f5",
                padding: "10px",
                borderRadius: "5px",
                whiteSpace: "pre-wrap",
                minHeight: "100px",
              }}
            >
              {reply.content}
            </div>
          </>
        ) : (
          <>
            <hr />
            <Form.Group controlId="replyContent" className="mb-3">
              <Form.Label>답변 입력</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="답변 내용을 입력하세요..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                style={{ resize: "none" }}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-content-end">
        <Button variant="outline-primary" onClick={handleClose}>
          닫기
        </Button>
        {!reply && (
          <Button
            variant="primary"
            onClick={handleSubmitReply}
            disabled={loading}
            className="me-2"
          >
            {loading ? "등록 중..." : "답변 등록"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AdminInquiryModal;
