import React, { useEffect, useState } from "react";
import { Modal, Spinner, Form, Button, Carousel, Card } from "react-bootstrap";
import api from "@/config/apiConfig";
import SecureImage from "@/components/common/SecureImage";
import { BsHeart, BsHeartFill, BsReply, BsTrash, BsPencil } from "react-icons/bs";
import "@/styles/feed/FeedDetailModal.css";

export default function FeedDetailModal({ feedId, show, onHide }) {
  const [feed, setFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null); // ✅ 로그인 유저 ID 기준

  /** 로그인한 사용자 정보 불러오기 */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/mypage/me");
        setCurrentUserId(res.data.id); // ✅ id 기준 비교
      } catch (err) {
        console.warn("로그인 사용자 정보 불러오기 실패:", err);
      }
    };
    fetchUser();
  }, []);

  /** 피드 상세 + 댓글 불러오기 */
  useEffect(() => {
    if (!feedId || !show) return;
    const fetchFeedAndComments = async () => {
      setLoading(true);
      try {
        const feedRes = await api.get(`/api/feeds/${feedId}`);
        const feedData = feedRes?.data?.data || feedRes?.data;
        setFeed(feedData);
        setLikeCount(feedData.likeCount || 0);
        setLiked(feedData.liked || false);

        const commentRes = await api.get(`/api/feeds/${feedId}/comments?page=1&size=50`);
        setComments(commentRes?.data?.data?.content || []);
      } catch (err) {
        console.error("피드 상세 또는 댓글 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedAndComments();
  }, [feedId, show]);

  /** 시간 포맷 */
  const formatTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /** 댓글 작성 */
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/api/feeds/${feedId}/comments`, { content: comment });
      const newComment = res?.data?.data;
      if (newComment) setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  /** 대댓글 작성 */
  const handleReplySubmit = async (parentId) => {
    if (!reply.trim()) return;
    try {
      const res = await api.post(`/api/feeds/${feedId}/comments/${parentId}/reply`, {
        content: reply,
      });
      const newReply = res?.data?.data;
      if (newReply) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies || []), newReply] }
              : c
          )
        );
      }
      setReply("");
      setReplyTo(null);
    } catch (err) {
      console.error("대댓글 등록 실패:", err);
    }
  };

  /** 댓글 삭제 */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/feeds/${feedId}/comments/${commentId}`);
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== commentId) || [],
          }))
      );
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  /** 댓글 수정 */
  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const res = await api.patch(`/api/feeds/${feedId}/comments/${commentId}`, {
        content: editContent,
      });
      const updated = res?.data?.data;
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, ...updated } : c))
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  /** 좋아요 토글 */
  const handleToggleLike = async () => {
    try {
      const res = await api.post(`/api/feeds/${feedId}/like`);
      const likeData = res?.data?.data;
      if (likeData) {
        setLiked(likeData.liked);
        setLikeCount(likeData.likeCount);
      }
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
    }
  };

  /** 댓글 렌더링 */
  const renderComment = (c, depth = 0) => (
    <Card
      key={c.id}
      className="mb-2 comment-card"
      style={{ marginLeft: depth > 0 ? 20 : 0 }}
    >
      <Card.Body className="p-2">
        {/* 댓글 헤더 */}
        <div className="d-flex align-items-center mb-1">
          <img
            src={c.profileImage || "/default-profile.png"}
            alt="프로필"
            className="me-2 rounded-circle"
            width={28}
            height={28}
          />
          <strong className="me-2">{c.nickname}</strong>
          <small className="text-muted">{formatTime(c.createdAt)}</small>
        </div>

        {/* 댓글 본문 */}
        {editingCommentId === c.id ? (
          <div className="mt-2">
            <Form.Control
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-1"
            />
            <Button
              variant="warning"
              size="sm"
              className="me-2"
              onClick={() => handleEditSubmit(c.id)}
            >
              저장
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditingCommentId(null)}
            >
              취소
            </Button>
          </div>
        ) : (
          <p className="mt-2 mb-1 ms-4">{c.content}</p>
        )}

        {/* 댓글 하단 버튼 */}
        <div className="text-end mt-1">
          <Button
            variant="link"
            size="sm"
            className="text-secondary p-0 me-2"
            onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
          >
            <BsReply size={14} /> 대댓글
          </Button>

          {currentUserId === c.writerId && (
            <>
              <Button
                variant="link"
                size="sm"
                className="text-success p-0 me-2"
                onClick={() => {
                  setEditingCommentId(c.id);
                  setEditContent(c.content);
                }}
              >
                <BsPencil size={14} /> 수정
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-danger p-0"
                onClick={() => handleDeleteComment(c.id)}
              >
                <BsTrash size={14} /> 삭제
              </Button>
            </>
          )}
        </div>

        {/* 대댓글 입력 */}
        {replyTo === c.id && (
          <div className="mt-2 ms-3">
            <Form.Control
              type="text"
              placeholder="답글을 입력하세요..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReplySubmit(c.id)}
            />
            <Button
              variant="outline-warning"
              size="sm"
              className="mt-1"
              onClick={() => handleReplySubmit(c.id)}
            >
              등록
            </Button>
          </div>
        )}

        {/* 대댓글 표시 */}
        {c.replies && c.replies.map((r) => renderComment(r, depth + 1))}
      </Card.Body>
    </Card>
  );

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="xl" className="feed-detail-modal">
      <Modal.Body className="feed-detail-body">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
          feed && (
            <div className="feed-detail-container">
              {/* 왼쪽 이미지 */}
              <div className="feed-detail-left">
                {feed.images?.length > 0 ? (
                  <Carousel indicators={feed.images.length > 1} controls={feed.images.length > 1}>
                    {feed.images.map((img, idx) => (
                      <Carousel.Item key={idx}>
                        <SecureImage
                          src={img}
                          alt={`feed-image-${idx}`}
                          className="feed-detail-image"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <p className="text-center text-muted">이미지 없음</p>
                )}
              </div>

              {/* 오른쪽 댓글 */}
              <div className="feed-detail-right">
                <div className="feed-writer">
                  <img
                    src={feed.profileImagePath || "/default-profile.png"}
                    alt="프로필"
                    className="writer-profile"
                  />
                  <strong>{feed.writerName}</strong>
                </div>

                <div className="feed-content mt-3">
                  <p>{feed.content}</p>
                </div>

                <div className="like-section my-2">
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={handleToggleLike}
                    style={{ color: liked ? "red" : "gray" }}
                  >
                    {liked ? <BsHeartFill size={22} /> : <BsHeart size={22} />}
                  </Button>
                  <span className="ms-2 fw-semibold">좋아요 {likeCount}개</span>
                </div>

                <hr />

                <div className="feed-comments">
                  {comments.length > 0 ? (
                    comments.map((c) => renderComment(c))
                  ) : (
                    <p className="text-muted small text-center mt-3">
                      댓글이 없습니다.
                    </p>
                  )}
                </div>

                <div className="comment-form mt-3">
                  <Form.Control
                    type="text"
                    placeholder="댓글을 입력하세요..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  />
                  <Button
                    variant="warning"
                    className="mt-2 w-100 fw-semibold"
                    onClick={handleCommentSubmit}
                  >
                    등록
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </Modal.Body>
    </Modal>
  );
}
