// src/components/feed/UserInfoComponent.jsx
import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import UserProfileImageFeed from "@/components/feed/UserProfileImageFeed";
import FeedOptionUnit from "@/components/feed/FeedOptionUnit";
import { deleteFeed } from "@/api/FeedService";
import UserPopover from "@/components/common/UserPopover";

export default function UserInfoComponent({
  writerName,
  feedId,
  writerPublicId,
  writerId,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const { user } = useContext(AuthContext); // 로그인한 사용자 정보 가져오기
  const navigate = useNavigate();

  // 작성자와 로그인 사용자 동일 여부 확인
  const isOwner = user?.publicId === writerPublicId;

  // 메뉴 닫기
  const closeMenu = () => setShowOptions(false);

  // 신고 기능
  const handleReport = () => {
    alert("게시글이 신고되었습니다.");
    closeMenu();
  };

  // 공유 기능
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/feeds/${feedId}`
      );
      alert("게시글 링크가 복사되었습니다!");
    } catch {
      alert("복사 실패! 브라우저 권한을 확인하세요.");
    }
    closeMenu();
  };

  // 수정 기능
  const handleEdit = () => {
    navigate(`/petstory/feed/edit/${feedId}`);
    closeMenu();
  };

  // 삭제 기능 (FeedService 적용)
  const handleDelete = async () => {
    if (!feedId) {
      alert("삭제할 피드 ID를 찾을 수 없습니다.");
      return;
    }

    if (window.confirm("정말 게시글을 삭제하시겠습니까?")) {
      try {
        await deleteFeed(feedId); // FeedService의 deleteFeed() 호출
        alert("게시글이 삭제되었습니다.");
        navigate("/petstory/feed"); // 목록으로 이동
      } catch (error) {
        console.error("피드 삭제 실패:", error);
        const message =
          error.response?.data?.message ||
          "게시글 삭제 중 오류가 발생했습니다.";
        alert(message);
      } finally {
        closeMenu();
      }
    } else {
      closeMenu();
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between p-3 position-relative">
      {/* 작성자 정보 */}
      <div className="d-flex align-items-center">
        <UserProfileImageFeed
          size={40}
          alt={`${writerName} 프로필 이미지`}
          style={{ marginRight: "12px" }}
          usersId={writerId}
        />
        <UserPopover userPublicId={writerPublicId} nickname={writerName}>
          <strong className="text-dark" style={{ cursor: "pointer" }}>
            {writerName}
          </strong>
        </UserPopover>{" "}
      </div>

      {/* 옵션 버튼 (⋮) */}
      <Button
        variant="link"
        className="text-muted p-0"
        onClick={() => setShowOptions(!showOptions)}
      >
        <FaEllipsisV />
      </Button>

      {/* 옵션 메뉴 */}
      {showOptions && (
        <FeedOptionUnit
          onClose={closeMenu}
          onReport={handleReport}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete} // 실제 삭제 이벤트 연결
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
