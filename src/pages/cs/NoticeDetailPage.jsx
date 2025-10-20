import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import api from "@/config/apiConfig";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorAlert from "@/components/common/ErrorAlert";

/**
 * 공지사항 상세 페이지
 * - 제목과 내용만 표시
 * - 수정/삭제 버튼 제거 (사용자용)
 */
const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 공지 상세 조회
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/notices/${id}`);
        setNotice(res.data);
      } catch (err) {
        console.error("공지 상세 조회 실패:", err);
        setError("공지 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  if (loading) return <LoadingSpinner message="공지사항 불러오는 중..." />;
  if (error) return <ErrorAlert message={error} variant="danger" />;
  if (!notice)
    return (
      <ErrorAlert
        message="해당 공지사항이 존재하지 않습니다."
        variant="warning"
        onGoBack={() => navigate("/notices")}
      />
    );

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={10} lg={10}>
        <div className="border rounded p-4 shadow-sm bg-white">
          {/* 제목 */}
          <h3 className="fw-bold mb-3">{notice.title}</h3>

          <hr />

          {/* 내용 */}
          <p style={{ whiteSpace: "pre-line", minHeight: "200px" }}>
            {notice.content}
          </p>

          {/* 하단 버튼 */}
          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate("/notices")}
            >
              목록으로
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default NoticeDetailPage;
