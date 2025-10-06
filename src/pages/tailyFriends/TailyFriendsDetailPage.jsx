import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import PostDetailContentCard from "../../components/board/postDetail/PostDetailContentCard";
import PostDetailCommentCard from "../../components/board/postDetail/PostDetailCommentCard";
import ErrorAlert from "../../components/common/ErrorAlert";

const TailyFriendDetailPage = () => {
  const { id } = useParams(); // 게시글 ID
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 리스트
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 게시글 + 댓글 조회
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [postRes, commentRes] = await Promise.all([
          api.get(`/api/taily-friends/${id}`),
          api.get(`/api/taily-friends/${id}/comments`),
        ]);

        if (postRes.data.success) setPost(postRes.data.data);
        if (commentRes.data.success) setComments(commentRes.data.data);
      } catch (err) {
        console.error("게시글 상세 조회 실패:", err);
        setError("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // 댓글 작성
  const handleAddComment = async (content) => {
    try {
      const response = await api.post(`/api/taily-friends/${id}/comments`, {
        content,
      });
      if (response.data.success) {
        // 새 댓글 추가 후 목록 갱신
        setComments((prev) => [response.data.data, ...prev]);
      }
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // 답글 작성
  const handleAddReply = async (commentId, content) => {
    try {
      const response = await api.post(
        `/api/taily-friends/${id}/comments/${commentId}/replies`,
        { content }
      );
      if (response.data.success) {
        // 해당 댓글의 replies 갱신
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...(c.replies || []), response.data.data] }
              : c
          )
        );
      }
    } catch (err) {
      console.error("답글 작성 실패:", err);
      alert("답글 작성 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error) return <ErrorAlert message={error} variant="danger" />;

  if (!post) return <div className="text-center mt-5">게시글이 없습니다.</div>;
  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={10} lg={10}>
        {/* 게시글 상세 */}
        <PostDetailContentCard post={post} />

        {/* 하단 버튼 */}
        <div className="d-flex justify-content-end mt-1 mb-4">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/taily-friends")}
          >
            목록으로
          </Button>
        </div>

        {/* 댓글 목록 */}
        <PostDetailCommentCard
          comments={comments}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
        />
      </Col>
    </Row>
  );
};

export default TailyFriendDetailPage;
