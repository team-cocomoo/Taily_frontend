import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SecureImage from "@/components/common/SecureImage";

import "../../../styles/ImageBox.css";

const TailyFriendsEditImageBox = ({ existingImages = [], onImageChange }) => {
  const [previews, setPreviews] = useState([]); // 서버 + 새 이미지 미리보기

  // ✅ 기존 서버 이미지 초기화 (한 번만 실행)
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      const mapped = existingImages.map((img) => ({
        id: img.id || crypto.randomUUID(),
        type: "url",
        data: img.filePath, // 서버에서 오는 경로 (예: /uploads/taily-friends/abc.jpg)
      }));
      setPreviews(mapped);
    }
  }, [existingImages]);

  // ✅ 파일 추가 시 새 미리보기 생성
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

    const updated = [...previews, ...newPreviews].slice(0, 3);
    setPreviews(updated);

    // 부모로 전달
    if (onImageChange) {
      const formatted = updated.map((p) =>
        p.type === "file"
          ? { type: "file", data: p.file, id: p.id }
          : { type: "url", data: p.data, id: p.id }
      );
      onImageChange(formatted);
    }
  };

  // ✅ 클릭 시 삭제
  const handleRemove = (id) => {
    const updated = previews.filter((p) => p.id !== id);
    setPreviews(updated);

    if (onImageChange) {
      const formatted = updated.map((p) =>
        p.type === "file"
          ? { type: "file", data: p.file, id: p.id }
          : { type: "url", data: p.data, id: p.id }
      );
      onImageChange(formatted);
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

        {/* ✅ 미리보기 (기존 서버 이미지 + 새 업로드 파일) */}
        {previews.map((p) =>
          p.type === "file" ? (
            <img
              key={p.id}
              src={p.data}
              alt="preview"
              className="image-preview"
              onClick={() => handleRemove(p.id)}
              title="클릭하면 삭제됩니다"
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

        {/* 파일 선택 */}
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
