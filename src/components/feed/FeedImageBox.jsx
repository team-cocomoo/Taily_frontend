import React, { useRef, useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";

/**
 * ImageBox.jsx
 *  - 새 이미지(File 객체)만 images 배열에 저장
 *  - 기존 이미지(existingImages)는 string 경로로 관리
 *  - 삭제된 이미지는 deletedImages 배열로 전달
 *  - onImageChange(imgList, deletedList) 형태로 상위에 전달
 */
export default function ImageBox({
  images = [], // File[]
  existingImages = [], // string[] (이미 서버에 저장된 이미지 경로)
  onImageChange,
}) {
  const fileInputRef = useRef();
  const [previewFiles, setPreviewFiles] = useState([]);
  const [existingPreviews, setExistingPreviews] = useState(existingImages);
  const [deletedImages, setDeletedImages] = useState([]);

  /** 기존 이미지 동기화 */
  useEffect(() => {
    setExistingPreviews(existingImages || []);
  }, [existingImages]);

  /** 새 이미지 선택 */
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // File 객체 배열만 유지
    const validFiles = files.filter((file) => file.size > 0);

    // 미리보기용 URL 생성
    const newPreviews = validFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    // 기존 previewFiles와 합치기
    setPreviewFiles((prev) => [...prev, ...newPreviews]);

    // 상위로 전달
    const updatedFiles = [...images, ...validFiles];
    onImageChange?.(updatedFiles, deletedImages);
  };

  /** 기존 이미지 삭제 */
  const handleRemoveExisting = (path) => {
    const updated = existingPreviews.filter((p) => p !== path);
    setExistingPreviews(updated);

    // 삭제 리스트 추가
    const updatedDeleted = [...deletedImages, path];
    setDeletedImages(updatedDeleted);

    // 상위로 알림
    onImageChange?.(images, updatedDeleted);
  };

  /** 새로 추가된 이미지 삭제 */
  const handleRemoveNew = (index) => {
    const updatedFiles = [...images];
    const updatedPreviews = [...previewFiles];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setPreviewFiles(updatedPreviews);
    onImageChange?.(updatedFiles, deletedImages);
  };

  return (
    <div className="image-box">
      {/* 파일 선택 */}
      <div className="mb-3">
        <Button
          variant="outline-secondary"
          onClick={() => fileInputRef.current.click()}
        >
          이미지 추가
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>

      {/* 기존 이미지 미리보기 */}
      {existingPreviews.length > 0 && (
        <div className="d-flex flex-wrap mb-3">
          {existingPreviews.map((path, idx) => (
            <div
              key={`existing-${idx}`}
              className="position-relative m-2"
              style={{ width: "100px", height: "100px" }}
            >
              <Image
                src={path.startsWith("http") ? path : `${path}`}
                thumbnail
                className="w-100 h-100 object-fit-cover"
              />
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0"
                onClick={() => handleRemoveExisting(path)}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* 새 이미지 미리보기 */}
      {previewFiles.length > 0 && (
        <div className="d-flex flex-wrap">
          {previewFiles.map((p, idx) => (
            <div
              key={`preview-${idx}`}
              className="position-relative m-2"
              style={{ width: "100px", height: "100px" }}
            >
              <Image
                src={p.url}
                thumbnail
                className="w-100 h-100 object-fit-cover"
              />
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0"
                onClick={() => handleRemoveNew(idx)}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
