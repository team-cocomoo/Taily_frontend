import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import SearchBar from "../../components/common/SearchBar";
import { ListGroup, Image } from "react-bootstrap";
import userIcon from "../../assets/image/user-icon.png";
import "../../styles/chatroom/ChatRoomMainPage.css";
import SecureImage from "../../components/common/SecureImage";

const ChatRoomMainPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false); // 검색 중 상태

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

  // 검색
  const handleSearch = async (nickname) => {
    // nickname이 없으면 기존 채팅방 리스트 다시 불러오기
    if (!nickname || nickname.trim() === "") {
      setSearchResults([]); // 검색 결과 초기화
      fetchChatRooms(); // 기존 채팅방 리스트 다시 불러오기
      return;
    }

    try {
      setSearching(true);
      const res = await api.get(`/api/chats/search?nickname=${nickname}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSearchResults(res.data?.data || []);
    } catch (err) {
      console.error("유저 검색 실패:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleRoomClick = (room) => {
    navigate(`/chats/${room.roomId}`, {
      state: { otherUsername: room.otherUsername },
    });
  };

  const handleUserClick = async (clickedUser) => {
    if (!user || !clickedUser) return;

    try {
      const res = await api.post("/api/chats", null, {
        params: {
          senderPublicId: user.publicId,
          receiverPublicId: clickedUser.publicId,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const room = res.data?.data;

      if (room) {
        navigate(`/chats/${room.roomId}`, {
          state: { otherUsername: clickedUser.username },
        });
      }
    } catch (err) {
      console.error("채팅방 생성 오류:", err.response?.data || err.message);
    }
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
      {/* 검색바 */}
      <div className="mb-3">
        <SearchBar placeholder="유저 검색..." onSearch={handleSearch} />
      </div>

      {/* 검색 결과 */}
      {searching ? (
        <div className="text-center">검색 중...</div>
      ) : searchResults.length > 0 ? (
        <div className="list-wrapper">
          <ListGroup variant="flush">
            {searchResults.map((user) => (
              <ListGroup.Item
                key={user.id}
                className="chat-room-item"
                onClick={() => handleUserClick(user)}
              >
                <SecureImage
                  src={user.profileImage || userIcon}
                  roundedCircle
                  className="chatroom-image"
                />
                <div className="info">
                  <div className="username">{user.nickname}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ) : (
        // 검색 결과 없으면 기존 채팅방
        <div className="list-wrapper">
          {chatRooms.length === 0 ? (
            <div>참여한 채팅방이 없습니다.</div>
          ) : (
            <ListGroup variant="flush">
              {chatRooms.map((room) => (
                <ListGroup.Item
                  key={room.roomId}
                  className="chat-room-item"
                  onClick={() => handleRoomClick(room)}
                >
                  <SecureImage
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
          )}
        </div>
      )}
    </div>
  );
};

export default ChatRoomMainPage;
