import React, { useState, useEffect, useContext } from "react";
import { OverlayTrigger, Popover, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";
import { AuthContext } from "@/contexts/AuthContext";
import SecureImage from "@/components/common/SecureImage";
import defaultUserIcon from "@/assets/image/user-icon.png";
import "@/styles/UserPopover.css";

const UserPopover = ({ userId, userPublicId, nickname, children }) => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 유저 정보 불러오기
  const fetchUserInfo = async () => {
    if (userInfo) return;
    setLoading(true);
    try {
      const res = userPublicId
        ? await api.get(`/api/user-profile/public/${userPublicId}`)
        : await api.get(`/api/user-profile/${userId}`);
      setUserInfo(res.data);

      // ✅ 프로필 이미지 가져오기 (tableTypesId=1, usersId=유저 PK)
      if (res.data?.id) {
        const imgRes = await api.get("/api/images", {
          params: { tableTypesId: 1, usersId: res.data.id },
        });
        if (imgRes.data?.length > 0) {
          setImagePath(imgRes.data[0].filePath);
        }
      }
    } catch (err) {
      console.error("유저 정보 조회 실패:", err);
      setUserInfo({ error: "유저 정보를 불러올 수 없습니다." });
    } finally {
      setLoading(false);
    }
  };

  const popover = (
    <Popover id={`popover-user-${userId}`} className="user-popover">
      <Popover.Header
        as="h3"
        className="popover-header d-flex flex-column align-items-center"
      >
        {/* ✅ SecureImage로 교체 */}
        {imagePath ? (
          <SecureImage
            src={imagePath}
            alt={`${nickname} 프로필`}
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
          />
        ) : (
          <img
            src={defaultUserIcon}
            alt="기본 프로필 이미지"
            className="user-img"
          />
        )}
        <p className="mt-2 mb-0">{nickname}</p>
      </Popover.Header>

      <Popover.Body className="popover-body">
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" size="sm" />
          </div>
        ) : userInfo ? (
          userInfo.error ? (
            <p>{userInfo.error}</p>
          ) : (
            <>
              <p>팔로워: {userInfo.followerCount}</p>
              <p>팔로잉: {userInfo.followingCount}</p>
              <p>게시글 수: {userInfo.postCount}</p>
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-fill"
                  onClick={() => navigate(`/user-profile/${userId}/profile`)}
                >
                  프로필 보기
                </Button>
              </div>
            </>
          )
        ) : (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" size="sm" />
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={popover}
      rootClose
      container={document.body}
      onToggle={(nextShow) => {
        if (nextShow) fetchUserInfo();
      }}
    >
      <span
        style={{
          cursor: "pointer",
          display: "inline-block",
          width: "fit-content",
          maxWidth: "100px",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </span>
    </OverlayTrigger>
  );
};

export default UserPopover;
