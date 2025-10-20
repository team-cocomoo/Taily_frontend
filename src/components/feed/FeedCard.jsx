// components/feed/FeedCard.jsx
import React from "react";
import { Card } from "react-bootstrap";
import { toggleLike } from "@/api/FeedService";
import UserInfoComponent from "./UserInfoComponent";
import SecureImage from "./SecureImage";
import FeedContent from "./FeedContent";
import "@/styles/feed/FeedCard.css";

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
    <div className="feed-wrapper">
      {" "}
      {/* 중앙 정렬 + 고정 너비 */}
      <Card className="feed-card shadow-sm border-0">
        {/* 작성자 정보 */}
        <UserInfoComponent
          writerName={writerName || "익명"}
          writerPublicId={feedData.writerPublicId}
          feedId={id}
          profileImageUrl={null}
        />

        {/* 이미지 표시 (contain으로 비율 유지 + 레터박스) */}
        {images.length > 0 &&
          images.map((img, idx) => (
            <div key={idx} className="feed-image-wrapper">
              <SecureImage
                src={img}
                alt={`feed-${id}-${idx}`}
                className="feed-image"
              />
            </div>
          ))}

        {/* 본문 내용 */}
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
    </div>
  );
}

export default FeedCard;
