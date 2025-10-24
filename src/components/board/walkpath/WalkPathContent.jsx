import { Card } from "react-bootstrap";
import MyEditor from "../../MyEditor.jsx";

const WalkPathContent = ({ content, setContent }) => {
  return (
    <Card className="mb-4 diary-box">
      <Card.Header> 산책 경로 </Card.Header>
      <Card.Body>
        <MyEditor
          value={content}
          onChange={setContent}
          placeholder="내용을 작성하세요"
        />
      </Card.Body>
    </Card>
  );
};

export default WalkPathContent;
