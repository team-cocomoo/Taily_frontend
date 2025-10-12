import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "../../styles/chatroom/ChatRoomDetailPage.css";
import userIcon from "../../assets/image/user-icon.png";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatRoomDetailPage = () => {
  const { id: roomId } = useParams(); // URL param
  const { state } = useLocation();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const token = localStorage.getItem("token");

  // 1️⃣ 메시지 불러오기
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chats/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("메시지 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, roomId, token]);

  // 2️⃣ WebSocket 연결
  useEffect(() => {
    if (!user) return;

    const socket = new SockJS("/ws"); // 서버 WebSocket 엔드포인트
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP:", str),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    client.onConnect = () => {
      client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [...prev, msg]);
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [user, roomId, token]);

  // 3️⃣ 스크롤 맨 아래 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4️⃣ 메시지 전송
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const payload = {
        roomId: Number(roomId),
        senderId: user.id, // senderId 포함
        content: newMessage,
      };

      await api.post("/api/chats/send", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 화면에 바로 추가
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          senderName: user.username,
          content: newMessage,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("메시지 전송 실패:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="chat-room-page">
      <h2 className="chat-room-title">{state?.otherUsername || "채팅방"}</h2>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="text-center text-muted py-4">메시지가 없습니다.</div>
        )}

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
