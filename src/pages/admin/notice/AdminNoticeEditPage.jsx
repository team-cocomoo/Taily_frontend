import React, { useEffect, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";
import "@/styles/admin/AdminNotice.css";

const AdminNoticeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /** 기존 공지 불러오기 */
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await api.get(`/api/notices/${id}`);
        const data = res.data;
        setFormData({
          title: data.title || "",
          content: data.content || "",
        });
      } catch (err) {
        console.error("공지 불러오기 실패:", err);
        setMessage("❌ 공지 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  /** 입력값 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 수정 요청 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put(`/api/notices/${id}`, formData);
      setMessage("✅ 공지가 성공적으로 수정되었습니다.");
      setTimeout(() => navigate(`/admin/main/notices/${id}`), 1000);
    } catch (err) {
      console.error("공지 수정 실패:", err);
      setMessage("❌ 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return <p className="admin-notice-loading">공지 정보를 불러오는 중...</p>;

  return (
    <div className="admin-notice-edit-wrapper">
      <Card className="admin-notice-edit-card">
        <h3 className="admin-notice-edit-title">공지 수정</h3>

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
              {loading ? "수정 중..." : "수정하기"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminNoticeEditPage;
