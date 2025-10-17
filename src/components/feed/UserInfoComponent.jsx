// components/feed/UserInfoComponent.jsx

import React from "react";
import { Image, Button } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa"; // 옵션 버튼 아이콘 (예시)

// props: writerName, profileImageUrl
function UserInfoComponent({ writerName, profileImageUrl }) {
  // 프로필 이미지 URL이 없을 경우 사용할 기본 이미지 URL (가정)
  const defaultProfile = "/path/to/default/profile.jpg";

  return (
    // p-3은 Bootstrap Padding Utility
    <div className="d-flex align-items-center justify-content-between p-3">
      <div className="d-flex align-items-center">
        {/* 프로필 이미지 */}
        <Image
          src={profileImageUrl || defaultProfile}
          alt={`${writerName} 프로필`}
          roundedCircle
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
          className="me-3"
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

export default UserInfoComponent;
