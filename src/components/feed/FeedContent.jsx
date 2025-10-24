import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";
import axios from "axios";

/**
 * FeedContent
 * - 좋아요 및 댓글 버튼
 * - 댓글 클릭 시 부모(FeedCard)에서 상세 모달 오픈
 */
function FeedContent({ feedData, onShowDetail }) {
  const {
    id,
    writer,
    content,
    date,
    likeCount: initialLikeCount,
    liked: initialLiked,
  } = feedData;

  const [liked, setLiked] = useState(initialLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);

  const tableTypeId = 3; // ✅ Feed 게시판 고정 ID

  /** 페이지 진입 시 현재 좋아요 상태 조회 */
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `https://taily24.store/api/likes/${tableTypeId}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLiked(res.data.data.liked);
      } catch (err) {
        console.error("좋아요 상태 조회 실패:", err);
      }
    };

    fetchLikeStatus();
  }, [id]);

  /** 좋아요 토글 (낙관적 UI 적용) */
  const handleToggleLike = async () => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 현재 상태 백업
    const prevLiked = liked;
    const prevCount = likeCount;

    // UI 먼저 업데이트
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));

    try {
      // 서버 요청
      await axios.post(
        `https://taily24.store/api/likes/${tableTypeId}/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 성공 시 그대로 유지
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 요청 중 오류가 발생했습니다.");

      //  실패 시 원상복귀
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  return (
    <div>
      {/* 좋아요 및 댓글 버튼 섹션 */}
      <div className="d-flex align-items-center mb-2">
        {/* 좋아요 버튼 */}
        <Button
          variant="link"
          className="p-0 me-2"
          style={{ color: liked ? "red" : "gray" }}
          onClick={handleToggleLike}
        >
          {liked ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
        </Button>
        <span className="me-3 text-muted" style={{ fontSize: "0.9rem" }}>
          {likeCount}개
        </span>

        {/* 댓글 버튼 */}
        <Button
          variant="link"
          className="p-0 text-muted me-auto"
          onClick={onShowDetail}
        >
          <BsChatDots size={20} />
        </Button>
      </div>

      {/* 글 내용 및 작성자 */}
      <div className="d-flex justify-content-between align-items-end">
        <div
          className="feed-content-text"
          style={{ flex: 1, whiteSpace: "pre-wrap" }}
        >
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
        <small className="text-muted ms-2">
          {new Date(date).toISOString().split("T")[0]}
        </small>
      </div>
    </div>
  );
}

export default FeedContent;
