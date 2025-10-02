import React, { useState } from "react";
import { Card, ListGroup, Form, Button } from "react-bootstrap";

const PostDetailCommentCard = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // 상위 컴포넌트에서 전달한 함수로 새 댓글 등록
    onAddComment(newComment);
    setNewComment(""); // 입력 초기화
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder="댓글을 작성하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" size="sm" variant="primary">
            작성
          </Button>
        </Form>
      </Card.Header>
      <ListGroup variant="flush">
        {comments && comments.length > 0 ? (
          comments.map((c) => (
            <ListGroup.Item key={c.id}>
              <strong>{c.nickname}</strong>: {c.content}
              <div className="text-muted small">
                {new Date(c.createdAt).toLocaleString()}
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
