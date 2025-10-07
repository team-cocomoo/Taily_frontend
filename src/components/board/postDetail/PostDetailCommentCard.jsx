import React, { useState, useContext, useEffect } from "react";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";
import messageIcon from "../../../assets/image/message-square.png";
import userIcon from "../../../assets/image/user-icon.png";
import "../../../styles/postDetail/PostDetailCommentCard.css";

const PostDetailCommentCard = ({ comments, onAddComment, onAddReply }) => {
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});

  const { user, loading } = useContext(AuthContext); 

  // 새 댓글 작성
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
  };
  useEffect(() => {
    console.log("로그인 상태 확인:");
    console.log("user:", user); // 로그인 된 유저 정보
    console.log("loading:", loading); // 인증 정보 로딩 중 여부
    console.log("isLoggedIn:", !!user); // true이면 로그인됨
  }, [user, loading]);

  // 답글 작성
  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    const text = replyText[commentId]?.trim();
    if (!text) return;
    onAddReply(commentId, text);
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    setShowReplyForm((prev) => ({ ...prev, [commentId]: false })); // 제출 후 폼 숨김
  };

  // 답글 폼 토글
  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <Card className="shadow-sm mb-5 post-card">
      {/* 댓글 작성 폼 */}
      {loading ? (
        <div className="text-center text-muted mt-3">로딩 중...</div>
      ) : user ? (
        <Card.Header className="card-header-section" style={{ border: "none" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="작성할 댓글 내용을 입력해 주세요."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                name="comment-section"
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
                <div className="d-flex justify-content align-items-center mt-1">
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

                {showReplyForm[c.id] && (
                  <Form
                    className="mt-2"
                    onSubmit={(e) => handleReplySubmit(e, c.id)}
                  >
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="작성할 댓글 내용을 입력해 주세요."
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
                        댓글 작성
                      </Button>
                    </div>
                  </Form>
                )}

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
                          alt={c.nickname}
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
    </Card>
  );
};

export default PostDetailCommentCard;
