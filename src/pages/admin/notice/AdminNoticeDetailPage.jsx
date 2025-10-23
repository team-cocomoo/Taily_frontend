import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";
import "@/styles/admin/AdminNotice.css";

const AdminNoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  /** 공지 상세 조회 */
  const fetchNotice = async () => {
    try {
      const res = await api.get(`/api/notices/${id}`);
      setNotice(res.data);
    } catch (err) {
      console.error("공지 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };
  /** 공지 삭제 요청 */
  const handleDelete = async () => {
    const confirmed = window.confirm("정말 이 공지를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/notices/${id}`);
      alert("공지가 삭제되었습니다.");
      navigate("/admin/main/notices");
    } catch (err) {
      console.error("공지 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  if (loading) {
    return <p className="admin-notice-loading">공지사항을 불러오는 중...</p>;
  }

  if (!notice) {
    return (
      <p className="text-center mt-5 text-muted">존재하지 않는 공지입니다.</p>
    );
  }

  return (
    <div className="admin-notice-detail-wrapper">
      <Card className="admin-notice-detail-card">
        {/* 제목 */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className="admin-notice-detail-title">{notice.title}</h3>
          <div className="admin-notice-detail-more">⋯</div>
        </div>

        {/* 본문 */}
        <div className="admin-notice-content-box">
          <p className="admin-notice-content">{notice.content}</p>
        </div>

        {/* 작성자, 작성일 */}
        <hr className="my-4" />
        <div className="admin-notice-info">
          <p>
            <strong>작성자:</strong> {notice.authorName || "admin"}
          </p>
          <p>
            <strong>작성일:</strong>{" "}
            {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </Card>

      {/* 목록 버튼 */}
      <div className="text-center mt-4">
        <Button
          variant="warning"
          className="admin-notice-back-btn"
          onClick={() => navigate("/admin/main/notices")}
        >
          목록으로 돌아가기
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/admin/main/notices/edit/${id}`)}
        >
          수정하기
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          삭제하기
        </Button>
      </div>
    </div>
  );
};

export default AdminNoticeDetailPage;
