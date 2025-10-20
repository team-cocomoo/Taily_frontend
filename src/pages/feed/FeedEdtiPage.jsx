import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import api from "@/config/apiConfig";
import FeedTextInput from "@/components/feed/FeedTextInput";
import FeedTagInput from "@/components/feed/FeedTagInput";
import ImageBox from "@/components/feed/FeedImageBox";

export default function FeedEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feed, setFeed] = useState(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]); // 새로 추가할 이미지 (File[])
  const [existingImages, setExistingImages] = useState([]); // 기존 이미지 경로
  const [deletedImages, setDeletedImages] = useState([]); // 삭제할 이미지 경로
  const [loading, setLoading] = useState(false);

  /** 기존 피드 데이터 불러오기 */
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get(`/api/feeds/${id}/edit`);
        const data = res.data;
        setFeed(data);
        setContent(data.content);
        setTags(data.tags || []);
        setExistingImages(data.images || []);
      } catch (err) {
        console.error("피드 수정 데이터 조회 실패:", err);
        alert("피드 정보를 불러오지 못했습니다.");
      }
    };
    fetchFeed();
  }, [id]);

  /** 이미지 변경 핸들러 */
  const handleImageChange = (imgList, deletedList) => {
    // File 객체만 저장 (data 속성 제거)
    const newFiles = imgList.map((img) => img.data ?? img).filter(Boolean);
    setImages(newFiles);
    setDeletedImages(deletedList || []);
  };

  const handleAddTag = (newTag) => setTags((prev) => [...prev, newTag]);
  const handleRemoveTag = (tag) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  /** 수정 요청 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert("내용을 입력해주세요!");

    setLoading(true);
    try {
      let uploadedPaths = [...existingImages];

      // 1. 삭제된 이미지 제거
      if (deletedImages.length > 0) {
        uploadedPaths = uploadedPaths.filter(
          (path) => !deletedImages.includes(path)
        );
      }

      // 2. 새 이미지 업로드
      if (images.length > 0) {
        const formData = new FormData();

        images.forEach((file) => {
          if (file instanceof File && file.size > 0) {
            formData.append("files", file);
          }
        });

        formData.append("tableTypesId", 3); // Feed용
        formData.append("postsId", id); // 연관 피드 ID

        const res = await api.post("/api/images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const newPaths = res.data.map((img) => img.filePath);
        uploadedPaths = [...uploadedPaths, ...newPaths];
      }

      // 3. 수정 요청 JSON 전송
      const feedData = {
        content,
        tags,
        imagePaths: uploadedPaths,
        tableTypeId: 3,
      };

      await api.put(`/api/feeds/${id}`, feedData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("피드가 수정되었습니다!");
      // navigate(`/petstory/feed/${id}`);
      navigate(`/petstory/feed`);
    } catch (err) {
      console.error(" 피드 수정 실패:", err);
      const status = err.response?.status;
      const data = err.response?.data;

      console.log(" 상태코드:", status);
      console.log(" 응답데이터:", data);

      const message =
        data?.message ||
        (status === 400
          ? "요청 형식이 잘못되었습니다. (400)"
          : status === 403
          ? "수정 권한이 없습니다. (403)"
          : status === 500
          ? "서버 오류가 발생했습니다. (500)"
          : "알 수 없는 오류입니다.");

      alert(`수정 실패: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!feed)
    return <p className="text-center mt-5">피드 정보를 불러오는 중...</p>;

  return (
    <Container className="mt-4 mb-5">
      <h3 className="mb-4 text-center">피드 수정하기</h3>

      <Card className="p-3 shadow-sm">
        <Form onSubmit={handleSubmit}>
          <FeedTextInput content={content} onChange={setContent} />
          <FeedTagInput
            tags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
          <ImageBox
            images={images}
            existingImages={existingImages}
            onImageChange={handleImageChange}
          />

          <div className="text-center mt-4">
            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={loading}
              className="px-5 rounded-pill"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  수정 중...
                </>
              ) : (
                "수정하기"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
