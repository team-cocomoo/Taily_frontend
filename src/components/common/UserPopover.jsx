import React, { useState } from "react";
import { OverlayTrigger, Popover, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/UserPopover.css";
import userIcon from "../../assets/image/user-icon.png";

const UserPopover = ({ userId, nickname, children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token"); // 로그인 토큰
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    if (userInfo) return; // 이미 로드된 경우 재호출 방지
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user-profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
    } catch (err) {
      console.error(err);
      setUserInfo({ error: "유저 정보를 불러올 수 없습니다." });
    }
  };

  const popover = (
    <Popover id={`popover-user-${userId}`} className="user-popover">
      <Popover.Header
        as="h3"
        className="popover-header  d-flex flex-column align-items-center"
      >
        <img src={userIcon} alt="프로필" className="user-img" />
        <p>{nickname}</p>
      </Popover.Header>
      <Popover.Body className="popover-body">
        {userInfo ? (
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
                  onClick={() => navigate(`/chat/${userId}`)}
                >
                  채팅
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-fill"
                  onClick={() => navigate(`/profile/${userId}`)}
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
