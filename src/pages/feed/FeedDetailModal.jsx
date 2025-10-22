import React, { useEffect, useState } from "react";
import { Modal, Spinner, Form, Button, Carousel, Card } from "react-bootstrap";
import SecureImage from "@/components/common/SecureImage";
import UserInfoComponent from "@/components/feed/UserInfoComponent";
import UserProfileImageFeed from "@/components/feed/UserProfileImageFeed";
import UserPopover from "@/components/common/UserPopover";

import {
  fetchFeedDetail,
  fetchComments,
  createComment,
  createReply,
  deleteComment,
  updateComment,
  toggleLike,
  fetchCurrentUser,
} from "@/api/FeedDetailModalService";
import {
  BsHeart,
  BsHeartFill,
  BsReply,
  BsTrash,
  BsPencil,
} from "react-icons/bs";
import "@/styles/feed/FeedDetailModal.css";

export default function FeedDetailModal({ feedId, feedData, show, onHide }) {
  const [feed, setFeed] = useState(feedData || null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(!feedData);
  const [currentUserId, setCurrentUserId] = useState(null);

  /** 로그인 사용자 로드 */
  useEffect(() => {
    fetchCurrentUser()
      .then((user) => setCurrentUserId(user.id))
      .catch(() => console.warn("로그인 사용자 정보 불러오기 실패"));
  }, []);

  /** 피드 및 댓글 로드 */
  useEffect(() => {
    if (!feedId || !show) return;

    const loadData = async () => {
      setLoading(true);
      try {
        let data = feedData;
        if (!feedData) data = await fetchFeedDetail(feedId);
        setFeed(data);
        setLikeCount(data.likeCount || 0);
        setLiked(data.liked || false);

        const commentList = await fetchComments(feedId);
        setComments(commentList);
      } catch (err) {
        console.error("피드 상세 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [feedId, show, feedData]);

  /** 좋아요 토글 */
  const handleToggleLike = async () => {
    try {
      const result = await toggleLike(feedId);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  };

  /** 댓글 등록 */
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const newComment = await createComment(feedId, comment);
      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  /** 대댓글 등록 */
  const handleReplySubmit = async (parentId) => {
    if (!reply.trim()) return;
    try {
      const newReply = await createReply(feedId, parentId, reply);
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      );
      setReply("");
      setReplyTo(null);
    } catch (err) {
      console.error("대댓글 등록 실패:", err);
    }
  };

  /** 댓글 삭제 */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteComment(feedId, commentId);
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
      const updated = await updateComment(feedId, commentId, editContent);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, ...updated } : c))
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
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
        <div className="d-flex align-items-center mb-1">
          <UserProfileImageFeed
            size={28}
            alt={`${c.nickname}의 프로필 이미지`}
            style={{ marginRight: "8px" }}
          />
          {/* 닉네임 클릭 시 팝오버 표시 */}
          <UserPopover userId={c.writerId} nickname={c.nickname}>
            <strong
              className="me-2"
              style={{ cursor: "pointer", color: "#222" }}
            >
              {c.nickname}
            </strong>
          </UserPopover>{" "}
          <small className="text-muted">
            {new Date(c.createdAt).toLocaleString("ko-KR", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        </div>

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

        {c.replies && c.replies.map((r) => renderComment(r, depth + 1))}
      </Card.Body>
    </Card>
  );

  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      className="feed-detail-modal"
    >
      <Modal.Body className="feed-detail-body">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
          feed && (
            <div className="feed-detail-container">
              <div className="feed-detail-left">
                {feed.images?.length > 0 ? (
                  <Carousel
                    indicators={feed.images.length > 1}
                    controls={feed.images.length > 1}
                  >
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

              <div className="feed-detail-right">
                <UserInfoComponent
                  writerName={feed.writerNickName || "익명"}
                  writerPublicId={feed.writerPublicId}
                  feedId={feed.id}
                  profileImageUrl={feed.profileImagePath || null}
                />

                <div className="feed-content mt-3">
                  <span dangerouslySetInnerHTML={{ __html: feed.content }} />
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
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCommentSubmit()
                    }
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
