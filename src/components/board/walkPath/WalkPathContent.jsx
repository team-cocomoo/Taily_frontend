import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import MyEditor from "../../MyEditor";

const WalkPathContent = ({ content, onChange }) => {
  const [localValue, setLocalValue] = useState("");

  // 처음 페이지 로드될 때 한 번만 초기화
  useEffect(() => {
    setLocalValue(content || ""); // 조건문 없이 한 번만
  }, []); // ✅ dependency 없앰

  const handleEditorChange = (value) => {
    setLocalValue(value); // 내부 값 갱신
    onChange(value); // 부모에도 전달
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>내용</Card.Header>
      <Card.Body>
        <MyEditor
          value={localValue}
          onChange={handleEditorChange}
          placeholder="내용을 적으세요"
        />
      </Card.Body>
    </Card>
  );
};

export default WalkPathContent;
