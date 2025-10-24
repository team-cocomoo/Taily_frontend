import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SecureImage from "@/components/common/SecureImage";
import "../../styles/ImageBox.css";

const ImageBox = ({ images: propImages = [], onImageChange }) => {
  const [previews, setPreviews] = useState([]);
  // propImages가 있을 때만 초기화
  useEffect(() => {
    if (!propImages || propImages.length === 0) return;

    const newPreviews = propImages.map((img) => {
      if (img.type === "file") {
        return {
          id: img.id || crypto.randomUUID(),
          type: "file",
          data: URL.createObjectURL(img.data),
          file: img.data,
        };
      } else if (img.type === "url") {
        return {
          id: img.id, // ✅ 서버에서 받은 DB id 그대로 유지
          type: "url",
          data: img.data, // /uploads/walk_diary/... 그대로
        };
      }
    });

    setPreviews(newPreviews);
  }, [propImages]); // propImages가 바뀔 때만 실행

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + previews.length > 3) {
      alert("사진은 최대 3장까지 업로드할 수 있어요!");
      return;
    }

    const newPreviews = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      type: "file",
      data: URL.createObjectURL(file),
      file,
    }));

    const updatedPreviews = [...previews, ...newPreviews].slice(0, 3);
    setPreviews(updatedPreviews);

    if (onImageChange) {
      const sendToParent = updatedPreviews.map((p) =>
        p.type === "url"
          ? { type: "url", data: p.data, id: p.id }
          : { type: "file", data: p.file, id: p.id }
      );
      onImageChange(sendToParent);
    }
  };

  /*
    기존 + 새 이미지 섞여 있을 때 삭제하면
    url이면 그대로 제외, file이면 미리보기에서 삭제.
  */
  const handleRemove = (id) => {
    const updatedPreviews = previews.filter((p) => p.id !== id);
    setPreviews(updatedPreviews);

    if (onImageChange) {
      const sendToParent = updatedPreviews.map((p) =>
        p.type === "url"
          ? { type: "url", data: p.data, id: p.id }
          : { type: "file", data: p.file, id: p.id }
      );
      onImageChange(sendToParent);
    }
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>
        사진 첨부{" "}
        <small className="text-muted px-2">산책하는 순간을 기록하세요</small>
      </Card.Header>
      <Card.Body className="d-flex align-items-center gap-2">
        <Form.Label
          htmlFor="photo"
          className="upload-tile mb-0 d-flex justify-content-center align-items-center"
        >
          <span className="add-image">+</span>
        </Form.Label>

        {/* ✅ 기존/새 이미지 미리보기 */}
        {previews.map((p) => (
          <div
            key={p.id}
            className="image-wrapper"
            style={{ cursor: "pointer" }}
            onClick={() => handleRemove(p.id)} // ✅ wrapper에서 처리
            title="클릭하면 삭제됩니다"
          >
            {p.type === "url" ? (
              <SecureImage
                src={
                  p.data.startsWith("http")
                    ? p.data
                    : `https://taily24.store${p.data}`
                }
                alt="기존 이미지"
                className="image-preview"
              />
            ) : (
              <img src={p.data} alt="새 이미지" className="image-preview" />
            )}
          </div>
        ))}

        {/* ✅ 숨겨진 파일 input */}
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
export default ImageBox;
