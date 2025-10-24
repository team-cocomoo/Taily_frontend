import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles/ImageBox.css";

const WalkPathImageBoxEdit = ({ images = [], setImages }) => {
  const [localExisting, setLocalExisting] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // ✅ 처음 마운트 시 기존 이미지 로드
  useEffect(() => {
    if (images && images.length > 0) {
      setLocalExisting(images);
    }
  }, [images]);

  // ✅ 기존 이미지 삭제
  const handleRemoveExisting = (id) => {
    const updated = localExisting.filter((img) => img.id !== id);
    setLocalExisting(updated);
    setImages([...updated, ...newImages]);
  };

  // ✅ 새 이미지 업로드
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + localExisting.length + newImages.length > 3) {
      alert("사진은 최대 3장까지 업로드할 수 있습니다.");
      return;
    }

    const updatedNewImages = [...newImages, ...files];
    setNewImages(updatedNewImages);
    setImages([...localExisting, ...updatedNewImages]);
  };

  // ✅ 새 이미지 삭제
  const handleRemoveNew = (idx) => {
    const updatedNewImages = newImages.filter((_, i) => i !== idx);
    setNewImages(updatedNewImages);
    setImages([...localExisting, ...updatedNewImages]);
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>
        사진 첨부 <small className="text-muted px-2">(최대 3장)</small>
      </Card.Header>
      <Card.Body className="d-flex align-items-center gap-2 flex-wrap">
        <Form.Label
          htmlFor="photo"
          className="upload-tile mb-0 d-flex justify-content-center align-items-center"
        >
          <span className="add-image">+</span>
        </Form.Label>

        {/* ✅ 기존 이미지 */}
        {localExisting.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="기존 이미지"
            onClick={() => handleRemoveExisting(img.id)}
            className="image-preview"
            title="클릭하면 삭제됩니다"
          />
        ))}

        {/* ✅ 새 이미지 */}
        {newImages.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt="새 이미지"
            onClick={() => handleRemoveNew(idx)}
            className="image-preview"
            title="클릭하면 삭제됩니다"
          />
        ))}

        <Form.Control
          type="file"
          id="photo"
          accept="image/*"
          multiple
          className="d-none"
          onChange={handleFileChange}
        />
      </Card.Body>
    </Card>
  );
};

export default WalkPathImageBoxEdit;
