// components/feed/FeedContent.jsx (수정)

import React from "react";
import { Button } from "react-bootstrap";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";

function FeedContent({ feedData, onToggleLike }) {
  const { writer, content, liked, likeCount, date } = feedData; // date 필드 추가 사용

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

      {/* 좋아요 수 및 글 내용 */}
      <div className="mb-2">
        <strong>좋아요 {likeCount}개</strong>
      </div>

      {/* 글 내용 및 작성자 닉네임 (피드 이미지 하단의 텍스트 형식) */}
      <div className="d-flex justify-content-between align-items-end">
        <span>
          <strong>{writer}</strong> {content}
        </span>
        <small className="text-muted">{date}</small> {/* 날짜 표시 */}
      </div>
    </div>
  );
}

export default FeedContent;
