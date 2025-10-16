import React, { useState, useEffect } from "react";
import { Card, ListGroup, Form, Button, Pagination } from "react-bootstrap";
import messageIcon from "../../../assets/image/message-square.png";
import userIcon from "../../../assets/image/user-icon.png";
import "../../../styles/postDetail/PostDetailCommentCard.css";
import api from "../../../config/apiConfig";

const PostDetailCommentCard = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [page, setPage] = useState(1); // ✅ 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // ✅ 전체 페이지 수

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // 댓글 목록 가져오기
  const fetchComments = async (pageNum = 1) => {
    try {
      const res = await api.get(
        `/api/walk-paths/${postId}/comments?page=${pageNum}&size=5`
      );

      const data = res.data?.data;

      // data 안에 content, page, totalPages가 들어 있음
      if (res.data.success && data) {
        setComments(data.content || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("댓글 조회 실패:", err);
    }
  };

  // 페이지 변경 시 댓글 다시 불러오기
  useEffect(() => {
    fetchComments(page);
  }, [page, postId]);

  // 댓글 작성
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isLoggedIn) {
      alert("로그인 후 댓글 작성이 가능합니다.");
      return;
    }

    try {
      const res = await api.post(`/api/walk-paths/${postId}/comments`, {
        content: newComment,
      });

      if (res.data.success || res.data.status === "success") {
        setNewComment("");
        setPage(1); // ✅ 첫 페이지로 리프레시
        fetchComments(1);
      }
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // 답글 작성
  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    const text = replyText[commentId]?.trim();
    if (!text) return;

    if (!isLoggedIn) {
      alert("로그인 후 답글 작성이 가능합니다.");
      return;
    }

    try {
      const res = await api.post(
        `/api/walk-paths/${postId}/comments/${commentId}/reply`,
        { content: text }
      );

      if (res.data.success || res.data.status === "success") {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...(c.replies || []), res.data.data] }
              : c
          )
        );
        setReplyText((prev) => ({ ...prev, [commentId]: "" }));
        setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
      }
    } catch (err) {
      console.error("답글 작성 실패:", err);
    }
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 페이지네이션 버튼 렌더링
  const renderPagination = () => (
    <div className="d-flex justify-content-center mt-4">
      <Pagination className="custom-pagination">
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        />
        {Array.from({ length: totalPages }, (_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={page === idx + 1}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        />
      </Pagination>
    </div>
  );

  return (
    <Card className="shadow-sm mb-5 post-card">
      {/* 댓글 작성 폼 */}
      {isLoggedIn ? (
        <Card.Header className="card-header-section" style={{ border: "none" }}>
          <Form onSubmit={handleAddComment}>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="작성할 댓글 내용을 입력해 주세요."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mt-4"
                style={{ resize: "none" }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3 mb-3">
              <Button type="submit" size="sm" variant="primary">
                <img
                  src={messageIcon}
                  alt="message"
                  style={{ width: 16, marginRight: 4 }}
                />
                댓글 작성
              </Button>
            </div>
          </Form>
        </Card.Header>
      ) : (
        <div className="text-center text-muted mt-3">
          💬 댓글을 작성하려면 로그인하세요.
        </div>
      )}

      {/* 댓글 리스트 */}
      <ListGroup variant="flush" className="comment-list">
        {comments && comments.length > 0 ? (
          comments.map((c) => (
            <ListGroup.Item
              key={c.id}
              className="d-flex comment-list"
              style={{ border: "none" }}
            >
              <img src={userIcon} alt={c.nickname} className="user-profile" />
              <div className="flex-grow-1 d-flex flex-column">
                <strong className="comment-nickname">{c.nickname}</strong>
                <div>{c.content}</div>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 me-3 reply-button"
                    onClick={() => toggleReplyForm(c.id)}
                  >
                    답글 달기
                  </Button>
                  <div className="text-muted small">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* 답글 폼 */}
                {showReplyForm[c.id] && (
                  <Form
                    className="mt-2"
                    onSubmit={(e) => handleAddReply(e, c.id)}
                  >
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="답글을 입력하세요."
                        value={replyText[c.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [c.id]: e.target.value,
                          }))
                        }
                        size="sm"
                        style={{ resize: "none" }}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-3">
                      <Button type="submit" size="sm" variant="primary">
                        <img
                          src={messageIcon}
                          alt="message"
                          style={{ width: 16, marginRight: 4 }}
                        />
                        답글 작성
                      </Button>
                    </div>
                  </Form>
                )}

                {/* 답글 리스트 */}
                {c.replies && c.replies.length > 0 && (
                  <ListGroup variant="flush" className="ms-4 mt-2">
                    {c.replies.map((r) => (
                      <ListGroup.Item
                        key={r.id}
                        className="d-flex"
                        style={{ border: "none" }}
                      >
                        <img
                          src={userIcon}
                          alt={r.nickname}
                          className="user-profile"
                        />
                        <div className="flex-grow-1 d-flex flex-column">
                          <strong>{r.nickname}</strong>
                          <div>{r.content}</div>
                          <div className="text-muted small mt-1">
                            {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>아직 댓글이 없습니다.</ListGroup.Item>
        )}
      </ListGroup>

      {/* ✅ 페이지네이션 */}
      {renderPagination()}
    </Card>
  );
};

export default PostDetailCommentCard;
