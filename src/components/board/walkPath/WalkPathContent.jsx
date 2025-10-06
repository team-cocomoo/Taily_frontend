import React from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyEditor from "../../MyEditor";

const WalkPathContent = () => {
  return (
    <Card className="mb-4 diary-box">
      <Card.Header>내용</Card.Header>
      <Card.Body>
        <MyEditor placeholder="내용을 적으세요" />
      </Card.Body>
    </Card>
  );
};

export default WalkPathContent;
