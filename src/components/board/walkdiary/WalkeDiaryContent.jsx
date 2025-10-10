import React from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MyEditor from "../../MyEditor";

const WalkeDiaryContent = ({ values, onChange }) => {
    return (
        <Card className="mb-4 diary-box">
        <Card.Header>오늘의 일기</Card.Header>
        <Card.Body>
            <MyEditor 
                placeholder="오늘의 산책을 기록해보세요" 
                value={values.content}
                onChange={(val) => onChange({ target: { name: "content", value: val } })}
            />
        </Card.Body>
        </Card>
    );
};

export default WalkeDiaryContent;
