// components/feed/FeedCard.jsx
import React from "react";
import { Card } from "react-bootstrap";
import { toggleLike } from "@/api/FeedService";
import UserInfoComponent from "./UserInfoComponent";
import SecureImage from "./SecureImage";
import FeedContent from "./FeedContent";

function FeedCard({ feedData, onUpdate }) {
  const {
    id,
    content,
    writerName,
    images = [],
    likeCount,
    createdAt,
    tags = [],
  } = feedData;

  // 좋아요 토글
  const handleToggleLike = async () => {
    try {
      const response = await toggleLike(id);
      onUpdate(id, {
        ...feedData,
        liked: response.data.liked,
        likeCount: response.data.likeCount,
      });
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      {/* 1️⃣ 작성자 정보 */}
      <UserInfoComponent
        writerName={writerName || "익명"}
        profileImageUrl={null} // 추후 User 프로필 이미지 연결 시 수정
      />

      {/* 2️⃣ 이미지 표시 */}
      {images.length > 0 &&
        images.map((img, idx) => (
          <SecureImage
            key={idx}
            src={img}
            alt={`feed-${id}-${idx}`}
            style={{
              maxHeight: "600px",
              objectFit: "cover",
              width: "100%",
              display: "block",
            }}
          />
        ))}

      {/* 3️⃣ 피드 내용 */}
      <Card.Body className="p-3">
        <FeedContent
          feedData={{
            content,
            likeCount,
            createdAt,
            tags,
          }}
          onToggleLike={handleToggleLike}
        />
      </Card.Body>
    </Card>
  );
}

export default FeedCard;
