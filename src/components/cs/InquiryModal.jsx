import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const InquiryModal = ({ show, handleClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token"); // 로그인 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/inquiries",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("문의 작성 성공:", response.data);
      alert("문의가 정상적으로 제출되었습니다!");
      setTitle("");
      setContent("");
      handleClose();
    } catch (error) {
      console.error("문의 작성 실패:", error.response?.data || error.message);
      alert("문의 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>1:1 문의 작성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              placeholder="문의 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="문의 내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: "none" }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handleClose}
          disabled={loading}
        >
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "제출 중..." : "문의 제출"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InquiryModal;
