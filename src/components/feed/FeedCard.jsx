import React, { useState } from "react";
import { Card, Carousel } from "react-bootstrap";
import { toggleLike } from "@/api/FeedService";
import UserInfoComponent from "./UserInfoComponent";
import SecureImage from "./SecureImage";
import FeedContent from "./FeedContent";
import "@/styles/feed/FeedCard.css";
import FeedDetailModal from "../../pages/feed/FeedDetailModal";

function FeedCard({ feedData, onUpdate }) {
  const {
    id,
    content,
    writerNickName,
    images = [],
    likeCount,
    createdAt,
    tags = [],
  } = feedData;

  const [showDetail, setShowDetail] = useState(false);

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
    <>
      <div className="feed-wrapper">
        <Card className="feed-card shadow-sm border-0">
          <UserInfoComponent
            writerName={writerNickName || "익명"}
            writerPublicId={feedData.writerPublicId}
            feedId={id}
            profileImageUrl={null}
            writerId={feedData.writerId}
          />

          {/* 이미지 캐러셀 */}
          {images.length > 0 && (
            <div className="feed-image-carousel">
              <Carousel
                indicators={images.length > 1}
                controls={images.length > 1}
                interval={null}
                fade={false}
                wrap={true}
              >
                {images.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    {/* 고정 비율 박스 */}
                    <div className="feed-image-box">
                      {/* 이미지 전체가 클릭 히트 영역(모달 열기) */}
                      <button
                        type="button"
                        className="image-hit-area"
                        onClick={() => setShowDetail(true)}
                        aria-label="이미지 자세히 보기"
                      >
                        <SecureImage
                          src={img}
                          alt={`feed-${id}-${idx}`}
                          className="feed-image"
                        />
                      </button>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          )}

          <Card.Body className="p-3">
            <FeedContent
              feedData={{
                id,
                writer: writerNickName,
                content,
                likeCount,
                date: createdAt,
              }}
              onToggleLike={handleToggleLike}
              onShowDetail={() => setShowDetail(true)}
            />
          </Card.Body>
        </Card>
      </div>

      <FeedDetailModal
        feedId={id}
        feedData={feedData}
        show={showDetail}
        onHide={() => setShowDetail(false)}
      />
    </>
  );
}

export default FeedCard;
