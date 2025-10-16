import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyEditor from "../MyEditor"; // 에디터 컴포넌트 import

/**
 * 피드 작성 시 본문 내용을 입력하는 컴포넌트
 * @param {string} content - 현재 입력된 내용
 * @param {function} setContent - 상위 컴포넌트에서 전달된 setter (예: setValues)
 */
const FeedContent = ({ content, setContent }) => {
  // 에디터 입력이 변경될 때마다 상위로 값 전달
  const handleEditorChange = (value) => {
    setContent(value);
  };

  return (
    <Card className="mb-4">
      <Card.Header>내용</Card.Header>
      <Card.Body>
        <MyEditor
          value={content}
          onChange={handleEditorChange}
          placeholder="피드 내용을 입력하세요."
        />
      </Card.Body>
    </Card>
  );
};

export default FeedContent;
