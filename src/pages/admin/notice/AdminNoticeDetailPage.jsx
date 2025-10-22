import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";
import { Card, Button, Row, Col } from "react-bootstrap";

const AdminNoticeDetailPage = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await api.get(`/api/notices/${id}`);
        setNotice(res.data);
      } catch (err) {
        console.error("공지 상세 조회 실패:", err);
      }
    };
    fetchNotice();
  }, [id]);

  /** 🔹 공지 삭제 요청 */
  const handleDelete = async () => {
    const confirmed = window.confirm("정말 이 공지를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/notices/${id}`);
      alert("✅ 공지가 삭제되었습니다.");
      navigate("/admin/main/notices");
    } catch (err) {
      console.error("공지 삭제 실패:", err);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!notice)
    return <p className="text-center mt-5">공지사항을 불러오는 중...</p>;

  return (
    <Card className="p-4 mt-4">
      {/* 제목 */}
      <h4>{notice.title}</h4>

      {/* 작성자 및 정보 */}
      <div className="text-muted mb-3">
        작성자: {notice.authorName || "관리자"} |{" "}
        {new Date(notice.createdAt).toLocaleString()} | 조회수:{" "}
        {notice.viewCount}
      </div>

      <hr />

      {/* 본문 */}
      <p style={{ whiteSpace: "pre-line", minHeight: "200px" }}>
        {notice.content}
      </p>

      <hr />

      {/* 버튼 영역 */}
      <Row className="mt-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            목록으로
          </Button>
        </Col>

        <Col className="text-end d-flex justify-content-end gap-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/admin/main/notices/edit/${id}`)}
          >
            🖋️ 수정하기
          </Button>

          <Button variant="danger" onClick={handleDelete}>
            ❌ 삭제하기
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default AdminNoticeDetailPage;
