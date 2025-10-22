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
    <>
      <div className="feed-wrapper">
        <Card className="feed-card shadow-sm border-0">
          {/* 작성자 정보 */}
          <UserInfoComponent
            writerName={writerNickName || "익명"}
            writerPublicId={feedData.writerPublicId}
            feedId={id}
            profileImageUrl={null}
          />

          {/* 이미지 캐러셀 */}
          {images.length > 0 && (
            <div
              className="feed-image-wrapper"
              onClick={() => setShowDetail(true)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              <Carousel
                indicators={images.length > 1} // 하단 점 표시 여부
                controls={images.length > 1} // 좌우 화살표 표시 여부
                interval={null} // 자동 슬라이드 X
                fade={false} // 부드럽게 전환
              >
                {images.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="feed-image-wrapper">
                      <SecureImage
                        src={img}
                        alt={`feed-${id}-${idx}`}
                        className="feed-image"
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          )}

          {/* 본문 */}
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
              onShowDetail={() => setShowDetail(true)} // 댓글 클릭 시 모달 열기
            />
          </Card.Body>
        </Card>
      </div>

      {/* 피드 상세 모달 */}
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
