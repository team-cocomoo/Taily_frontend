import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, Form, Button, Pagination } from "react-bootstrap";
import messageIcon from "../../../assets/image/message-square.png";
import userIcon from "../../../assets/image/user-icon.png";
import "../../../styles/postdetail/PostDetailCommentCard.css";
import api from "../../../config/apiConfig";
import { AuthContext } from "../../../contexts/AuthContext";
import SecureImage from "../../common/SecureImage";
import UserPopover from "../../common/UserPopover";

const PostDetailCommentCard = ({ postId }) => {
  const { user } = useContext(AuthContext);
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
  const currentUserNickname = user?.nickname;

  // ✅ 댓글 목록 가져오기
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

  // ✅ 댓글 작성
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
    }
  };

  // ✅ 답글 작성
  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    const text = replyText[commentId]?.trim();
    if (!text) return;
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

  // ✅ 댓글/답글 수정
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

  // ✅ 댓글/답글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      const res = await api.delete(
        `/api/taily-friends/${postId}/comments/${commentId}`
      );
      if (res.data.success) {
        alert("삭제 완료되었습니다.");
        fetchComments(page);
      }
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const toggleReplyForm = (commentId) =>
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

  const toggleEditForm = (commentId, content) => {
    setEditMode((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    setEditText((prev) => ({ ...prev, [commentId]: content }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // ✅ 페이지네이션 렌더링
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
        {comments.length > 0 ? (
          comments.map((c) => (
            <ListGroup.Item
              key={c.id}
              className="d-flex"
              style={{ border: "none" }}
            >
              {c.profileImage ? (
                <SecureImage
                  src={c.profileImage}
                  alt={c.nickname}
                  className="user-profile"
                />
              ) : (
                <img
                  src={userIcon}
                  alt="기본 프로필"
                  className="user-profile"
                />
              )}
              <div className="flex-grow-1 d-flex flex-column">
                <UserPopover userId={c.userId} nickname={c.nickname}>
                  <strong className="comment-nickname">{c.nickname}</strong>
                </UserPopover>

                {/* 부모 댓글 수정 모드 */}
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

                    {/* 답글 입력창 */}
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

                    {/* ✅ 답글 리스트 */}
                    {c.replies?.length > 0 && (
                      <ListGroup variant="flush" className="ms-4 mt-2">
                        {c.replies.map((r) => (
                          <ListGroup.Item
                            key={r.id}
                            className="d-flex"
                            style={{ border: "none" }}
                          >
                            {r.profileImage ? (
                              <SecureImage
                                src={r.profileImage}
                                alt={r.nickname}
                                className="user-profile"
                              />
                            ) : (
                              <img
                                src={userIcon}
                                alt="기본 프로필"
                                className="user-profile"
                              />
                            )}
                            <div className="flex-grow-1 d-flex flex-column">
                              <UserPopover
                                userId={r.userId}
                                nickname={r.nickname}
                              >
                                <strong className="comment-nickname">
                                  {r.nickname}
                                </strong>
                              </UserPopover>

                              {editMode[r.id] ? (
                                <>
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={editText[r.id]}
                                    onChange={(e) =>
                                      setEditText((prev) => ({
                                        ...prev,
                                        [r.id]: e.target.value,
                                      }))
                                    }
                                    size="sm"
                                    className="mt-1 mb-2"
                                  />
                                  <div className="d-flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() => handleUpdateComment(r.id)}
                                    >
                                      저장
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      onClick={() =>
                                        setEditMode((prev) => ({
                                          ...prev,
                                          [r.id]: false,
                                        }))
                                      }
                                    >
                                      취소
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>{r.content}</div>
                                  <div className="d-flex justify-content-between align-items-center mt-1">
                                    {currentUserNickname === r.nickname && (
                                      <div>
                                        <Button
                                          variant="link"
                                          size="sm"
                                          className="p-0 me-2 comment-edit-delete-button"
                                          onClick={() =>
                                            toggleEditForm(r.id, r.content)
                                          }
                                        >
                                          수정
                                        </Button>
                                        <Button
                                          variant="link"
                                          size="sm"
                                          className="p-0 comment-edit-delete-button"
                                          onClick={() =>
                                            handleDeleteComment(r.id)
                                          }
                                        >
                                          삭제
                                        </Button>
                                      </div>
                                    )}
                                    <div className="text-muted small">
                                      {new Date(r.createdAt).toLocaleString()}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
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
      {comments.length > 0 && renderPagination()}
    </Card>
  );
};

export default PostDetailCommentCard;
