// src/pages/feed/FeedWritePage.jsx
import React, { useState } from "react";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import api from "@/config/apiConfig";
import FeedTextInput from "@/components/feed/FeedTextInput";
import FeedTagInput from "@/components/feed/FeedTagInput";
import ImageBox from "@/components/board/ImageBox";
import "@/styles/feed/FeedWritePage.css";

/**
 * FeedWritePage.jsx
 *  피드 등록 먼저 (/api/feeds)
 * 응답받은 feedId로 이미지 업로드 (/api/images/upload)
 * 태그 및 이미지 연결
 */
export default function FeedWritePage() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]); // File 객체 배열
  const [loading, setLoading] = useState(false);

  const handleAddTag = (newTag) => setTags((prev) => [...prev, newTag]);
  const handleRemoveTag = (tag) =>
    setTags((prev) => prev.filter((t) => t !== tag));
  const handleImageChange = (imgList) => setImages(imgList);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert("내용을 입력해주세요!");

    setLoading(true);
    try {
      // 피드 본문 먼저 등록 (이미지 없이)
      const feedData = {
        content,
        tags,
        tableTypeId: 3, // FEED
      };

      const feedRes = await api.post("/api/feeds", feedData, {
        headers: { "Content-Type": "application/json" },
      });

      const feedId = feedRes.data.id;
      console.log(" 피드 등록 완료, feedId =", feedId);

      // 이미지 업로드 (feedId 기반)
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("files", img.data));
        formData.append("tableTypesId", 3); // Feed용
        formData.append("postsId", feedId); // 연관 피드 ID

        const uploadRes = await api.post("/api/images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(" 업로드된 이미지 목록:", uploadRes.data);
      }

      alert("피드가 등록되었습니다!");
      window.location.href = "/petstory/feed";
    } catch (err) {
      console.error(" 피드 등록 실패:", err);
      alert("등록 실패: 다시 시도해주세요.");
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
          </div>
        </Form>
      </Card>
    </Container>
  );
}
