import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_BASE = "/api/chats";

// REST API
export const getChatRooms = () => axios.get(`${API_BASE}`);
export const createChatRoom = (user1Id, user2Id) =>
  axios.post(`${API_BASE}?user1Id=${user1Id}&user2Id=${user2Id}`);
export const getRoomMessages = (roomId) =>
  axios.get(`${API_BASE}/${roomId}/messages`);
export const sendMessageRest = (dto) => axios.post(`${API_BASE}/send`, dto);

// WebSocket
let stompClient;

export const connectWebSocket = (roomId, onMessageReceived) => {
  const socket = new SockJS("/ws"); // 백엔드 STOMP 엔드포인트
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    console.log("WebSocket connected");
    stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
      const message = JSON.parse(msg.body);
      onMessageReceived(message);
    });
  };

  stompClient.activate();
};

export const sendMessageWS = (dto) => {
  if (stompClient && stompClient.active) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(dto),
    });
  }
};
