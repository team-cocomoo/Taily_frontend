import React from "react";
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const WalkPathTitle = ({ value, onChange }) => {
  return (
    <Card className="mb-4 title-box">
      <Card.Body>
        
        <Form.Control
          type="text"
          placeholder="제목을 입력하세요"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="title-input"
        />
      </Card.Body>
    </Card>
  );
};

export default WalkPathTitle;
