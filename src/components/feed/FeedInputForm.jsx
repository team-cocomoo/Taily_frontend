import React from "react";
import { Form } from "react-bootstrap";
import MyEditor from "../MyEditor"; // CKEditor 컴포넌트 import (경로 맞게 조정)

// CKEditor 기반 피드 입력 폼
const FeedInputForm = ({ content, setContent }) => {
  return (
    <div className="title-box mb-3">
      <Form.Group>
        <Form.Label>내용</Form.Label>
        <div className="editor-wrapper">
          <MyEditor
            value={content}
            onChange={setContent}
            placeholder="일상을 기록하세요 🐶😸"
          />
        </div>
      </Form.Group>
    </div>
  );
};

export default FeedInputForm;
