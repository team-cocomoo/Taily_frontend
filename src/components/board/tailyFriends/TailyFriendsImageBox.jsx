import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SecureImage from "@/components/common/SecureImage";

import "../../../styles/ImageBox.css";

const TailyFriendsImageBox = ({
  existingImages = [],
  newImages = [],
  onImageChange,
}) => {
  const [previews, setPreviews] = useState([]);

  // ✅ 기존 서버 이미지 표시
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      const existingPreviews = existingImages.map((img) => ({
        id: img.id || crypto.randomUUID(),
        type: "url",
        data: img.filePath, // SecureImage에서 JWT 포함 요청
      }));
      setPreviews(existingPreviews);
    }
  }, [existingImages]);

  // ✅ 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + previews.length > 3) {
      alert("사진은 최대 3장까지 업로드할 수 있어요!");
      return;
    }

    const newPreviews = files.map((file) => ({
      id: crypto.randomUUID(),
      type: "file",
      data: URL.createObjectURL(file),
      file,
    }));

    const updatedPreviews = [...previews, ...newPreviews].slice(0, 3);
    setPreviews(updatedPreviews);

    if (onImageChange) {
      const sendToParent = updatedPreviews.map((p) =>
        p.type === "file"
          ? { type: "file", data: p.file, id: p.id }
          : { type: "url", data: p.data, id: p.id }
      );
      onImageChange(sendToParent);
    }
  };

  // ✅ 이미지 삭제
  const handleRemove = (id) => {
    const updated = previews.filter((p) => p.id !== id);
    setPreviews(updated);

    if (onImageChange) {
      const sendToParent = updated.map((p) =>
        p.type === "file"
          ? { type: "file", data: p.file, id: p.id }
          : { type: "url", data: p.data, id: p.id }
      );
      onImageChange(sendToParent);
    }
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>
        사진 첨부{" "}
        <small className="text-muted px-2">같이 산책할 공간을 올려주세요</small>
      </Card.Header>

      <Card.Body className="d-flex align-items-center gap-2 flex-wrap">
        {/* 업로드 버튼 */}
        <Form.Label
          htmlFor="photo"
          className="upload-tile mb-0 d-flex justify-content-center align-items-center"
        >
          <span className="add-image">+</span>
        </Form.Label>

        {/* ✅ SecureImage로 서버 이미지 표시 */}
        {previews.map((p) =>
          p.type === "file" ? (
            <img
              key={p.id}
              src={p.data}
              alt="preview"
              className="image-preview"
              onClick={() => handleRemove(p.id)}
            />
          ) : (
            <SecureImage
              key={p.id}
              src={p.data}
              alt="server"
              className="image-preview"
              onClick={() => handleRemove(p.id)}
            />
          )
        )}

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

export default TailyFriendsImageBox;
