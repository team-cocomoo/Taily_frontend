// src/pages/feed/FeedWritePage.jsx
import React, { useState } from "react";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";

import FeedTextInput from "@/components/feed/FeedTextInput";
import FeedTagInput from "@/components/feed/FeedTagInput";
import ImageBox from "@/components/board/ImageBox";
import "@/styles/feed/FeedWritePage.css";

/**
 * FeedWritePage.jsx
 * - 피드 본문 등록 → /api/feeds
 * - 응답받은 feedId로 이미지 업로드 → /api/images/upload
 * - 입력값: 본문(content), 태그(tags), 이미지(images)
 */
export default function FeedWritePage() {
  const navigate = useNavigate();

  // 상태값
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]); // File 객체 배열
  const [loading, setLoading] = useState(false);

  // 태그 추가 / 삭제
  const handleAddTag = (newTag) => setTags((prev) => [...prev, newTag]);
  const handleRemoveTag = (tag) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  // 이미지 변경
  const handleImageChange = (imgList) => setImages(imgList);

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      /**  피드 본문 + 태그 먼저 등록 */
      const feedData = {
        content,
        tags,
        tableTypeId: 3, // FEED 구분용
      };

      const feedRes = await api.post("/api/feeds", feedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const feedId = feedRes.data.id;
      console.log("피드 등록 완료:", feedId);

      /** 이미지 업로드 (있을 경우만) */
      if (images.length > 0) {
        const formData = new FormData();
        formData.append("tableTypesId", 3);
        formData.append("postsId", feedId);

        // File 객체 추가
        images.forEach((file) => formData.append("files", file.data));

        const uploadRes = await api.post("/api/images/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(" 업로드된 이미지:", uploadRes.data);
      }

      alert("피드가 성공적으로 등록되었습니다!");
      navigate("/petstory/feed");
    } catch (err) {
      console.error(" 피드 등록 실패:", err);
      alert("등록 실패! 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <h3 className="mb-4 text-center">오늘의 일상 기록</h3>

      <Card className="p-3 shadow-sm">
        <Form onSubmit={handleSubmit}>
          {/* 본문 입력 */}
          <FeedTextInput content={content} onChange={setContent} />

          {/* 태그 입력 */}
          <FeedTagInput
            tags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />

          {/* 이미지 업로드 */}
          <ImageBox images={images} onImageChange={handleImageChange} />

          {/* 등록 버튼 */}
          <div className="text-center mt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="px-5 rounded-pill"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  등록 중...
                </>
              ) : (
                "등록하기"
              )}
            </Button>
            <Button
              className="btn btn-outline-primary feed-write-cancel"
              onClick={() => {
                navigate("/petstory/feed"); // 페이지 이동
              }}
            >
              취소하기
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
