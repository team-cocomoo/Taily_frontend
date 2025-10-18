// pages/feed/FeedWritePage.jsx
import React, { useState } from "react";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import { createFeed } from "@/api/FeedService";
import FeedTextInput from "@/components/feed/FeedTextInput";
import FeedTagInput from "@/components/feed/FeedTagInput";
import ImageBox from "@/components/board/ImageBox.jsx";
import "@/styles/feed/FeedWritePage.css";

export default function FeedWritePage() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddTag = (newTag) => setTags((prev) => [...prev, newTag]);
  const handleRemoveTag = (tag) =>
    setTags((prev) => prev.filter((t) => t !== tag));
  const handleImageChange = (imgList) => setImages(imgList);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    // ✅ 백엔드 @RequestPart("feed")에 맞춰 JSON 파트를 Blob으로 추가
    const feedData = { content, tags };

    const formData = new FormData();
    formData.append(
      "feed",
      new Blob([JSON.stringify(feedData)], { type: "application/json" })
    );

    // 파일 파트(여러 장) 그대로 추가 (@RequestPart(value="images"))
    images.forEach((img) => {
      if (img.type === "file") {
        formData.append("images", img.data);
      }
    });

    try {
      setLoading(true);
      await createFeed(formData); // axios가 boundary 포함 헤더를 자동 설정
      alert("피드가 등록되었습니다!");
      window.location.href = "/petstory/feed";
    } catch (err) {
      console.error("피드 등록 실패:", err);
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
          <FeedTextInput content={content} onChange={setContent} />
          <FeedTagInput
            tags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
          <ImageBox images={[]} onImageChange={handleImageChange} />

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
