import React from "react";
import { Card } from "react-bootstrap";
import MyEditor from "../../MyEditor";

const TailyFriendsContent = ({ content, setContent }) => {
  return (
    <Card className="mb-4 diary-box">
      <Card.Header>테일리프렌즈 구하기</Card.Header>
      <Card.Body>
        <MyEditor
          value={content} 
          onChange={setContent}
          placeholder="내용을 작성해 테일리프렌즈를 구해보세요."
        />
      </Card.Body>
    </Card>
  );
};

export default TailyFriendsContent;
