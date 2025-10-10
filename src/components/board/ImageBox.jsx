import React, { useState } from 'react';
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "../../styles/ImageBox.css";

const ImageBox = ({ onImageChange }) => {
    const [previews, setPreviews] = useState([]);   // 이미지 미리보기 상태
    const [images, setImages] = useState([]);   // 부모로 보낼 이미지

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // 최대 3장까지 허용
        if (files.length + previews.length > 3) {
            alert("사진은 최대 3장까지 업로드할 수 있어요!");
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews].slice(0, 3));

        // File 객체 자체를 저장
        const newImages = [...images, ...files].slice(0, 3);
        setImages(newImages);

        // 부모로 File 배열 전달
        if (onImageChange) onImageChange(newImages);
    };

    // 미리보기 사진 클릭 시 특정 인덱스 삭제
    const handleRemove = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        const updatedFiles = images.filter((_, i) => i !== index);
        setImages(updatedFiles);
        if (onImageChange) onImageChange(updatedFiles);
    };

    return (
        <Card className="mb-4 diary-box">
            <Card.Header>사진 첨부{" "}<small className='text-muted px-2' >산책하는 순간을 기록하세요</small></Card.Header>
            <Card.Body className='d-flex align-items-center gap-2'>
                <Form.Label
                    htmlFor='photo'
                    className='upload-tile mb-0 d-flex justify-content-center align-items-center'
                >
                <span className='add-image'>+</span>
                </Form.Label>
                    {/* 미리보기 (최대 3장) */}
                    {previews.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`preview-${idx}`}
                            onClick={() => handleRemove(idx)}   // 클릭 시 삭제
                            className='image-preview'
                            title="클릭하면 삭제됩니다"
                        />
                    ))}
                <Form.Control 
                    type="file" 
                    id='photo'
                    accept='image/*'
                    multiple
                    className='d-none'
                    onChange={handleFileChange}
                />
            </Card.Body>
        </Card>
    );
};

export default ImageBox;