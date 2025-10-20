import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "../../styles/chatroom/ChatRoomDetailPage.css";
import userIcon from "../../assets/image/user-icon.png";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import SecureImage from "../../components/common/SecureImage";

const ChatRoomDetailPage = () => {
  const { id: roomId } = useParams();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null); // ✅ 상대방 정보
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const token = localStorage.getItem("token");

  // ✅ 채팅방 정보 + 메시지 불러오기
  useEffect(() => {
    if (!user) return;

    const fetchRoomDetail = async () => {
      try {
        const res = await api.get(`/api/chats/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data;
        if (data) {
          setMessages(data.messages || []);
          setRoomInfo({
            nickname: data.otherNickname,
            profileImage: data.otherProfileImage,
            username: data.otherUsername,
          });
        }
      } catch (err) {
        console.error("❌ 채팅방 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [user, roomId, token]);

  useEffect(() => {
    if (!user) return;

    const socket = new SockJS(`http://localhost:8080/ws-chat`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP:", str),
    });

    client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [...prev, msg]);
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => client.deactivate();
  }, [user, roomId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const payload = {
        roomId: Number(roomId),
        senderId: user.id,
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    hours = hours % 12 || 12;
    return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="chat-room-page">
      <h2 className="chat-room-title">
        {roomInfo?.nickname || "채팅방"}
      </h2>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="text-center text-muted py-4">메시지가 없습니다.</div>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderName === user.username;
          return (
            <div
              key={msg.id}
              className={`chat-message ${isMine ? "my-message" : "other-message"}`}
            >
              {!isMine && (
                <SecureImage
                  src={roomInfo?.profileImage || userIcon}
                  alt={msg.senderName}
                  className="chat-profile-image"
                />
              )}

              <div className="message-container">
                {!isMine && (
                  <div className="message-nickname">{msg.senderName}</div>
                )}
                <div className="message-body">{msg.content}</div>
                <div className="message-time">{formatDate(msg.createdAt)}</div>
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
