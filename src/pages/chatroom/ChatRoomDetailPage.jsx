import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../config/apiConfig";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "../../styles/chatroom/ChatRoomDetailPage.css";
import userIcon from "../../assets/image/user-icon.png";

const ChatRoomDetailPage = () => {
  const { id } = useParams(); // roomId 대신 id
  const { state } = useLocation();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // 메시지 불러오기
  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chats/${id}/messages`, {
          // id 사용
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("메시지 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user, id]); // 의존성 배열에 id

  // 스크롤 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post(
        "/api/chats/send",
        { roomId: parseInt(id), content: newMessage }, // roomId 대신 id
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: newMessage,
          senderName: user.username,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("메시지 전송 실패:", err);
    }
  };

  if (loading) return <LoadingSpinner />;
  console.log(messages);
  return (
    <div className="chat-room-page">
      <h2 className="chat-room-title">{state?.otherUsername || "채팅방"}</h2>

      <div className="chat-messages">
        {messages.map((msg) => {
          const isMine = msg.senderName === user.username;
          return (
            <div
              key={msg.id}
              className={`chat-message ${
                isMine ? "my-message" : "other-message"
              }`}
            >
              {!isMine && (
                <img
                  src={state?.otherProfileImage || userIcon}
                  alt={msg.senderName}
                  className="chat-profile-image"
                />
              )}

              <div className="message-container">
                {!isMine && (
                  <div className="message-nickname">{msg.senderName}</div>
                )}
                <div className="message-body">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatRoomDetailPage;
