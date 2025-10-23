import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import api from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";
import "@/styles/admin/AdminNotice.css";

const AdminNoticeWritePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /** 입력값 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 공지 등록 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/notices", formData);
      setMessage("공지가 성공적으로 등록되었습니다.");
      setTimeout(() => navigate("/admin/main/notices"), 1000);
    } catch (err) {
      console.error("공지 등록 실패:", err);
      setMessage("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-notice-write-wrapper">
      <Card className="admin-notice-write-card">
        <h3 className="admin-notice-write-title">공지 등록</h3>

        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label className="fw-semibold">제목</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="공지 제목을 입력하세요"
              required
            />
          </Form.Group>

          <Form.Group controlId="formContent" className="mb-3">
            <Form.Label className="fw-semibold">내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="공지 내용을 입력하세요"
              required
            />
          </Form.Group>

          {message && (
            <Alert
              variant={message.startsWith("✅") ? "success" : "danger"}
              className="mt-3 text-center"
            >
              {message}
            </Alert>
          )}

          <div className="text-center mt-4">
            <Button
              variant="secondary"
              className="me-2 admin-notice-cancel-btn"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              variant="warning"
              type="submit"
              className="admin-notice-submit-btn"
              disabled={loading}
            >
              {loading ? "등록 중..." : "등록하기"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminNoticeWritePage;
