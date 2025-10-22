import React, { useState, useEffect, useContext } from "react";
import { OverlayTrigger, Popover, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/UserPopover.css";
import userIcon from "../../assets/image/user-icon.png";

const UserPopover = ({ userId, userPublicId, nickname, children }) => {
  const { user } = useContext(AuthContext); // 로그인 사용자 정보
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 유저 정보 가져오기
  const fetchUserInfo = async () => {
    if (userInfo) return; // 이미 로드된 경우 재호출 방지
    setLoading(true);
    try {
      let res;
      if (userId) {
        // PK(id) 기반 조회
        res = await api.get(`/api/user-profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (userPublicId) {
        // publicId 기반 조회
        res = await api.get(`/api/user-profile/public/${userPublicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        throw new Error("userId 또는 userPublicId가 필요합니다.");
      }

      setUserInfo(res.data);
    } catch (err) {
      console.error("유저 정보 조회 실패:", err);
      setUserInfo({ error: "유저 정보를 불러올 수 없습니다." });
    } finally {
      setLoading(false);
    }
  };

  // 메시지 버튼 클릭
  const handleChatClick = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // 채팅방 존재 여부 확인
      const res = await api.get(
        `/api/chats/exists?senderPublicId=${user.publicId}&receiverPublicId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const room = res.data?.data;

      if (room) {
        // 기존 채팅방으로 이동
        navigate(`/chats/${room.roomId}`, {
          state: {
            otherUsername: nickname,
            otherProfileImage: userIcon,
          },
        });
      } else {
        // 새 채팅방 생성 후 이동
        const createRes = await api.post(
          `/api/chats?senderPublicId=${user.publicId}&receiverPublicId=${userInfo.publicId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newRoom = createRes.data?.data;

        navigate(`/chats/${newRoom.roomId}`, {
          state: {
            otherUsername: nickname,
            otherProfileImage: userIcon,
          },
        });
      }
    } catch (err) {
      console.error("채팅방 이동 실패:", err);
      alert("채팅방 이동 중 오류가 발생했습니다.");
    }
  };

  const popover = (
    <Popover id={`popover-user-${userId}`} className="user-popover">
      <Popover.Header
        as="h3"
        className="popover-header d-flex flex-column align-items-center"
      >
        <img src={userIcon} alt="프로필" className="user-img" />
        <p>{nickname}</p>
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
                  onClick={handleChatClick}
                >
                  메세지
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-fill"
                  onClick={() => navigate(`/user-profile/${userId}/profile`)}
                >
                  프로필
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
