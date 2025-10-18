import React from "react";
import { Button } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import UserProfileImageFeed from "@/components/feed/UserProfileImageFeed"; // 추가 import

/**
 * 피드 상단 유저 정보 컴포넌트
 * - 내부에서 UserProfileImageFeed를 통해 로그인 유저의 프로필 이미지 자동 표시
 *
 * @param {string} writerName - 작성자 닉네임
 */
export default function UserInfoComponent({ writerName }) {
  return (
    <div className="d-flex align-items-center justify-content-between p-3">
      <div className="d-flex align-items-center">
        {/* ✅ JWT 인증 프로필 이미지 */}
        <UserProfileImageFeed
          size={40}
          alt={`${writerName} 프로필 이미지`}
          style={{ marginRight: "12px" }}
        />

        {/* 작성자 닉네임 */}
        <strong className="text-dark">{writerName}</strong>
      </div>

      {/* 옵션 버튼 (신고, 삭제, 수정 등) */}
      <Button variant="link" className="text-muted p-0">
        <FaEllipsisV />
      </Button>
    </div>
  );
}
