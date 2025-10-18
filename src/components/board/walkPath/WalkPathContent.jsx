import React from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyEditor from "../../MyEditor";

const WalkPathContent = ({ content, setContent }) => {
  //에디터의 입력값이 바뀔때마다 상위로 값을 전달
  const handleEditorChange = (value) => {
    setContent(value);
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>내용</Card.Header>
      <Card.Body>
        <MyEditor
          value={content} // 상위에서 내려준 값
          onChange={handleEditorChange} // 상위로 다시 전달
          placeholder="내용을 적으세요"
        />  
      </Card.Body>
    </Card>
  );
};

export default WalkPathContent;
