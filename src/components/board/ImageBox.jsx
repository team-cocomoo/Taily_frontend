import React, { useState } from 'react';
import { Form, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ImageBox = () => {
    const [preview, setPreview] = useState(null);   // 이미지 미리보기 상태

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);  // Base64로 변환
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <Card className="mb-4">
            <Card.Header>사진 첨부 <small className='text-muted'>산책하는 순간을 기록하세요</small></Card.Header>
            <Card.Body>
                <Form.Control type="file" />
            </Card.Body>
        </Card>
    );
};

export default ImageBox;