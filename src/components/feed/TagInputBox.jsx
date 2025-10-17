import React from "react";
import { Form } from "react-bootstrap";

const FeedInputForm = ({ content, setContent }) => {
  return (
    <div className="title-box mb-3">
      <Form.Group>
        <Form.Label>태그 입력</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="태그를 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>
    </div>
  );
};

export default FeedInputForm;
