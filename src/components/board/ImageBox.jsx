import React, { useState, useEffect } from 'react';
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "../../styles/ImageBox.css";

const ImageBox = ({ images: propImages = [], onImageChange }) => {
    const [previews, setPreviews] = useState([]);

    // propImages가 있을 때만 초기화
    useEffect(() => {
        if (!propImages || propImages.length === 0) return;

        const newPreviews = propImages.map(img => ({
            id: img.id || crypto.randomUUID(),
            type: img.type,
            data: img.type === "url" ? img.data : URL.createObjectURL(img.data),
            file: img.type === "file" ? img.data : null
        }));

        setPreviews(newPreviews);
    }, [propImages]); // propImages가 바뀔 때만 실행

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + previews.length > 3) {
            alert("사진은 최대 3장까지 업로드할 수 있어요!");
            return;
        }

        const newPreviews = selectedFiles.map(file => ({
            id: crypto.randomUUID(),
            type: "file",
            data: URL.createObjectURL(file),
            file
        }));

        const updatedPreviews = [...previews, ...newPreviews].slice(0, 3);
        setPreviews(updatedPreviews);

        if (onImageChange) {
            const sendToParent = updatedPreviews.map(p =>
                p.type === "url" ? { type: "url", data: p.data, id: p.id } : { type: "file", data: p.file, id: p.id }
            );
            onImageChange(sendToParent);
        }
    };

    const handleRemove = (id) => {
        const updatedPreviews = previews.filter(p => p.id !== id);
        setPreviews(updatedPreviews);

        if (onImageChange) {
            const sendToParent = updatedPreviews.map(p =>
                p.type === "url" ? { type: "url", data: p.data, id: p.id } : { type: "file", data: p.file, id: p.id }
            );
            onImageChange(sendToParent);
        }
    };

    return (
        <Card className="mb-4 diary-box">
            <Card.Header>
                사진 첨부 <small className='text-muted px-2'>산책하는 순간을 기록하세요</small>
            </Card.Header>
            <Card.Body className='d-flex align-items-center gap-2'>
                <Form.Label
                    htmlFor='photo'
                    className='upload-tile mb-0 d-flex justify-content-center align-items-center'
                >
                    <span className='add-image'>+</span>
                </Form.Label>

                {previews.map((p) => (
                    <img
                        key={p.id}
                        src={p.data}
                        alt="preview"
                        onClick={() => handleRemove(p.id)}
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
