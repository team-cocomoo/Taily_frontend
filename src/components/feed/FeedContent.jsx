// components/feed/FeedContent.jsx (리팩토링 완료)

import React from "react";
import { Button } from "react-bootstrap";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";

function FeedContent({ feedData, onToggleLike }) {
  const { writer, content, liked, likeCount, date } = feedData;

  return (
    <div>
      {/* 좋아요 및 댓글 버튼 섹션 */}
      <div className="d-flex align-items-center mb-2">
        {/* 좋아요 버튼 */}
        <Button
          variant="link"
          className="p-0 me-2"
          style={{ color: liked ? "red" : "gray" }}
          onClick={onToggleLike}
        >
          {liked ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
        </Button>

        {/* 댓글 버튼 */}
        <Button variant="link" className="p-0 text-muted me-auto">
          <BsChatDots size={20} />
        </Button>
      </div>

      {/* 좋아요 수 */}
      <div className="mb-2">
        <strong>좋아요 {likeCount}개</strong>
      </div>

      {/* 글 내용 및 작성자 */}
      <div className="d-flex justify-content-between align-items-end">
        <div className="feed-content-text" style={{ flex: 1, whiteSpace: "pre-wrap" }}>
          <strong>{writer}</strong>{" "}
          <span
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              display: "inline-block",
              lineHeight: "1.6",
              marginLeft: "4px",
            }}
          />
        </div>
        <small className="text-muted ms-2">{date}</small>
      </div>
    </div>
  );
}

export default FeedContent;
