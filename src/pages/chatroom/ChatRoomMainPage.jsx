import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ListGroup, Image } from "react-bootstrap";
import userIcon from "../../assets/image/user-icon.png";
import "../../styles/chatroom/ChatRoomMainPage.css";

const ChatRoomMainPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      fetchChatRooms();
    }
  }, [authLoading, user]);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/chats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const roomsData = res.data?.data?.rooms || [];
      const roomsCount = res.data?.data?.count || 0;

      setChatRooms(roomsData);
      setCount(roomsCount);
    } catch (err) {
      console.error("채팅방 조회 실패:", err);
      setChatRooms([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (roomId, otherUsername) => {
    navigate(`/chats/${roomId}`, { state: { otherUsername } });
  };

  if (authLoading || loading) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="chat-room-list">
      <h2>참여한 채팅방 ({count})</h2>
      {chatRooms.length === 0 ? (
        <div>참여한 채팅방이 없습니다.</div>
      ) : (
        <div className="list-wrapper">
          <ListGroup variant="flush">
            {chatRooms.map((room) => (
              <ListGroup.Item
                key={room.roomId}
                className="chat-room-item"
                onClick={() => handleRoomClick(room.roomId, room.otherUsername)}
              >
                <Image
                  src={room.otherProfileImage || userIcon}
                  roundedCircle
                  className="chatroom-image"
                />
                <div className="info">
                  <div className="username">{room.otherUsername}</div>
                  <div className="last-message">
                    {room.lastMessageContent || "메시지가 없습니다"}
                  </div>
                </div>
                <div className="time">
                  {room.lastMessageTime
                    ? new Date(room.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default ChatRoomMainPage;
