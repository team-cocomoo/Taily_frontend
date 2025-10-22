import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SecureImage from "@/components/common/SecureImage";

import "../../../styles/ImageBox.css";

const TailyFriendsEditImageBox = ({ existingImages = [], onImageChange }) => {
  const [previews, setPreviews] = useState([]);

  /** ✅ existingImages가 변경될 때 초기 세팅 (처음 1회 + 게시글 로드 후 1회) */
  useEffect(() => {
    if (existingImages && existingImages.length > 0 && previews.length === 0) {
      const mapped = existingImages.map((img) => ({
        id: img.id || crypto.randomUUID(),
        type: "url",
        data: img.filePath?.startsWith("/uploads")
          ? img.filePath
          : img.filePath?.replace(/^.*\/uploads/, "/uploads"),
      }));
      setPreviews(mapped);
    }
  }, [existingImages]); // ✅ props 변경 시 반영

  /** ✅ previews 변경될 때 부모에게 전달 */
  useEffect(() => {
    if (onImageChange) {
      const formatted = previews.map((p) =>
        p.type === "file"
          ? { type: "file", data: p.file, id: p.id }
          : { type: "url", data: p.data, id: p.id }
      );
      onImageChange(formatted);
    }
  }, [previews]);

  /** ✅ 파일 추가 */
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

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  /** ✅ 삭제 처리 */
  const handleRemove = (id) => {
    const target = previews.find((p) => p.id === id);
    if (target?.type === "file") {
      URL.revokeObjectURL(target.data);
    }
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>
        사진 첨부{" "}
        <small className="text-muted px-2">같이 산책할 공간을 올려주세요</small>
      </Card.Header>
      <Card.Body className="d-flex align-items-center gap-2 flex-wrap">
        <Form.Label
          htmlFor="photo"
          className="upload-tile mb-0 d-flex justify-content-center align-items-center"
        >
          <span className="add-image">+</span>
        </Form.Label>

        {previews.map((p) => (
          <div
            key={p.id}
            className="image-wrapper"
            onClick={() => handleRemove(p.id)}
            title="클릭하면 삭제됩니다"
            style={{ cursor: "pointer", position: "relative" }}
          >
            {p.type === "file" ? (
              <img src={p.data} alt="preview" className="image-preview" />
            ) : (
              <SecureImage src={p.data} alt="server" className="image-preview" />
            )}
          </div>
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

export default TailyFriendsEditImageBox;
