import React from "react";
import { Form, Card } from "react-bootstrap";

const TailyFriendsTitle = ({ title, setTitle }) => {
  return (
    <Card className="mb-4 diary-box">
      <Card.Header>제목</Card.Header>
      <Card.Body>
        <Form.Group controlId="titleInput">
          <Form.Control
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default TailyFriendsTitle;
