// components/feed/FeedTagInput.jsx
import React, { useState } from "react";
import { Form, Row, Col, Button, Badge } from "react-bootstrap";

/**
 * 태그 입력/삭제 컴포넌트
 * @param {Array} tags - 현재 등록된 태그 목록
 * @param {function} onAddTag - 태그 추가 핸들러
 * @param {function} onRemoveTag - 태그 삭제 핸들러
 */
export default function FeedTagInput({ tags, onAddTag, onRemoveTag }) {
  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const newTag = input.trim();
    if (newTag && !tags.includes(newTag)) {
      onAddTag(newTag);
    }
    setInput("");
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>태그 등록</Form.Label>
      <Row className="g-2">
        <Col xs={9}>
          <Form.Control
            type="text"
            placeholder="예: #강아지 #공원 #산책"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Col>
        <Col xs={3}>
          <Button
            variant="outline-primary"
            className="w-100"
            onClick={handleAdd}
          >
            추가
          </Button>
        </Col>
      </Row>

      <div className="mt-2">
        {tags.map((tag, idx) => (
          <Badge
            bg="secondary"
            key={idx}
            className="me-2 mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => onRemoveTag(tag)}
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </Form.Group>
  );
}
