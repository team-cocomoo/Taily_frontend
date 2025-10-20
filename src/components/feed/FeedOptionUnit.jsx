// src/components/feed/FeedOptionUnit.jsx
import React, { useRef, useEffect } from "react";
import { Card } from "react-bootstrap";

/**
 * 피드 옵션 메뉴 (수정 / 삭제 / 신고 / 공유)
 * @param {boolean} isOwner - 작성자 본인 여부
 * @param {function} onClose - 메뉴 닫기 함수
 * @param {function} onEdit - 수정 이벤트
 * @param {function} onDelete - 삭제 이벤트
 * @param {function} onReport - 신고 이벤트
 * @param {function} onShare - 공유 이벤트
 */
export default function FeedOptionUnit({
  isOwner,
  onClose,
  onEdit,
  onDelete,
  onReport,
  onShare,
}) {
  const menuRef = useRef();

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <Card
      ref={menuRef}
      className="position-absolute"
      style={{
        top: "40px",
        right: "0",
        width: "150px",
        border: "1px solid #bca58f",
        zIndex: 1000,
      }}
    >
      {isOwner ? (
        <>
          <div
            onClick={onEdit}
            style={{
              padding: "8px 10px",
              cursor: "pointer",
              borderBottom: "1px solid #bca58f",
            }}
          >
            피드 수정하기
          </div>
          <div
            onClick={onDelete}
            style={{
              padding: "8px 10px",
              cursor: "pointer",
              borderBottom: "1px solid #bca58f",
              color: "red",
            }}
          >
            피드 삭제하기
          </div>
        </>
      ) : (
        <>
          <div
            onClick={onReport}
            style={{
              padding: "8px 10px",
              cursor: "pointer",
              borderBottom: "1px solid #bca58f",
            }}
          >
            피드 신고하기
          </div>
          <div
            onClick={onShare}
            style={{ padding: "8px 10px", cursor: "pointer" }}
          >
            게시글 공유하기
          </div>
        </>
      )}
    </Card>
  );
}
