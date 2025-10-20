import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, Form, Button, Pagination } from "react-bootstrap";
import messageIcon from "../../../assets/image/message-square.png";
import userIcon from "../../../assets/image/user-icon.png";
import "../../../styles/postDetail/PostDetailCommentCard.css";
import api from "../../../config/apiConfig";
import { AuthContext } from "../../../contexts/AuthContext"; // ✅ 추가

const PostDetailCommentCard = ({ postId }) => {
  const { user } = useContext(AuthContext); // ✅ 로그인 유저 정보 가져오기
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editText, setEditText] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const currentUserNickname = user?.nickname; // ✅ AuthContext에서 닉네임 가져오기

  // 댓글 목록 가져오기
  const fetchComments = async (pageNum = 1) => {
    try {
      const res = await api.get(
        `/api/taily-friends/${postId}/comments?page=${pageNum}&size=5`
      );

      const data = res.data?.data;
      if (res.data.success && data) {
        setComments(data.content || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("댓글 조회 실패:", err);
    }
  };

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
      const res = await api.post(`/api/taily-friends/${postId}/comments`, {
        content: newComment,
      });

      if (res.data.success) {
        setNewComment("");
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
        `/api/taily-friends/${postId}/comments/${commentId}/reply`,
        { content: text }
      );

      if (res.data.success) {
        setReplyText((prev) => ({ ...prev, [commentId]: "" }));
        setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
        fetchComments(page);
      }
    } catch (err) {
      console.error("답글 작성 실패:", err);
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId) => {
    try {
      const newContent = editText[commentId]?.trim();
      if (!newContent) return alert("내용을 입력해주세요.");

      const res = await api.patch(
        `/api/taily-friends/${postId}/comments/${commentId}`,
        { content: newContent }
      );

      if (res.data.success) {
        setEditMode((prev) => ({ ...prev, [commentId]: false }));
        fetchComments(page);
      }
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await api.delete(
        `/api/taily-friends/${postId}/comments/${commentId}`
      );
      if (res.data.success) {
        alert("댓글이 삭제되었습니다.");
        fetchComments(page);
      }
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleEditForm = (commentId, content) => {
    setEditMode((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    setEditText((prev) => ({ ...prev, [commentId]: content }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPagination = () =>
    comments &&
    comments.length > 0 && (
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
      {/* 댓글 작성 */}
      {isLoggedIn ? (
        <Card.Header className="card-header-section" style={{ border: "none" }}>
          <Form onSubmit={handleAddComment}>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="댓글을 입력하세요."
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
              className="d-flex"
              style={{ border: "none" }}
            >
              <img src={userIcon} alt={c.nickname} className="user-profile" />
              <div className="flex-grow-1 d-flex flex-column">
                <strong className="comment-nickname">{c.nickname}</strong>

                {editMode[c.id] ? (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editText[c.id]}
                      onChange={(e) =>
                        setEditText((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                      size="sm"
                      className="mt-1 mb-2"
                      style={{ resize: "none" }}
                    />
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleUpdateComment(c.id)}
                      >
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() =>
                          setEditMode((prev) => ({ ...prev, [c.id]: false }))
                        }
                      >
                        취소
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{c.content}</div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <div>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 me-3 reply-button"
                          onClick={() => toggleReplyForm(c.id)}
                        >
                          답글 달기
                        </Button>
                        {currentUserNickname === c.nickname && (
                          <>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 me-2 comment-edit-delete-button"
                              onClick={() => toggleEditForm(c.id, c.content)}
                            >
                              수정
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 comment-edit-delete-button"
                              onClick={() => handleDeleteComment(c.id)}
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-muted small">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>아직 댓글이 없습니다.</ListGroup.Item>
        )}
      </ListGroup>

      {/* 페이지네이션 */}
      {comments && comments.length > 0 && renderPagination()}
    </Card>
  );
};

export default PostDetailCommentCard;
