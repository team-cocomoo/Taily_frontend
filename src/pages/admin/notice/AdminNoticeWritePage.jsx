import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import api from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";

const AdminNoticeWritePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /** 입력값 변경 핸들러 */
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
      setMessage("✅ 공지가 성공적으로 등록되었습니다.");
      setTimeout(() => navigate("/admin/main/notices"), 1000);
    } catch (err) {
      console.error("공지 등록 실패:", err);
      setMessage("❌ 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mt-4">
      <h4 style={{ fontWeight: "bold" }}>공지 등록</h4>
      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>제목</Form.Label>
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
          <Form.Label>내용</Form.Label>
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
            className="mt-3"
          >
            {message}
          </Alert>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AdminNoticeWritePage;
