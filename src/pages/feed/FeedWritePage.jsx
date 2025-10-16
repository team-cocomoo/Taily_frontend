import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import ImageBox from "../../components/board/ImageBox";
import FeedContent from "../../components/feed/FeedContent.jsx"; // 에디터 or 텍스트박스 컴포넌트
// import "../../styles/feed/FeedWritePage.css"; // (선택)

const FeedWritePage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState("");

  // 태그 입력 처리
  const handleTagsChange = (e) => setTags(e.target.value);

  // 업로드 핸들러
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();

      // 태그 문자열을 배열로 변환
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      // JSON 데이터 구성
      const feedData = {
        content: content,
        tableTypeId: 3, // Feed 테이블 유형 ID
        tags: tagArray,
      };

      // JSON -> Blob 변환 후 FormData에 추가
      formData.append(
        "feed",
        new Blob([JSON.stringify(feedData)], { type: "application/json" })
      );

      // 이미지 파일 추가
      images.forEach((file) => formData.append("images", file));

      // 업로드 요청
      await axios.post("http://localhost:8080/api/feeds", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("피드 업로드 완료!");
      navigate("/petstory/feed");
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  return (
    <div className="container main-content">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* 업로드 카드 */}
          <Card className="shadow-sm mb-4">
            <Card.Header>피드 작성</Card.Header>
            <Card.Body>
              {/* 내용 입력 */}
              <FeedContent content={content} setContent={setContent} />

              {/* 이미지 업로드 */}
              <ImageBox images={images} setImages={setImages} />

              {/* 태그 입력 */}
              <Form.Group className="mt-3">
                <Form.Label>태그</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="태그를 ,로 구분하여 입력하세요"
                  value={tags}
                  onChange={handleTagsChange}
                />
              </Form.Group>

              {/* 버튼 */}
              <div className="d-flex justify-content-center gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/feeds")}
                >
                  목록
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  업로드
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedWritePage;
