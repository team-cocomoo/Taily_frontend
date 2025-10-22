// components/feed/FeedTextInput.jsx
import React from "react";
import { Card } from "react-bootstrap";
import MyEditor from "@/components/MyEditor";

/**
 * 글 작성 컴포넌트
 * @param {string} content - 작성 중인 내용
 * @param {function} onChange - 내용 변경 핸들러
 */
const FeedTextInput = ({ content, onChange }) => {
  return (
    <Card className="mb-4 diary-box shadow-sm">
      <Card.Header>글 작성</Card.Header>
      <Card.Body>
        <MyEditor
          placeholder="오늘의 일상을 기록해보세요 😸🐾"
          value={content}
          onChange={(val) => onChange(val)}
        />
      </Card.Body>
    </Card>
  );
};

export default FeedTextInput;
