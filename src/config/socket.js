// src/config/socket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "ws://localhost:8080/ws-chat";

let stompClient = null;

export const connectSocket = (token, publicId, onMessageReceived) => {
      console.log("🌐 [Socket] Handshake 요청 시도 →", `${SOCKET_URL}?token=${token}`);

  stompClient = new Client({
    webSocketFactory: () => new WebSocket(`${SOCKET_URL}?token=${token}`),
    reconnectDelay: 5000,
    debug: (str) => console.log("🐞 [STOMP DEBUG]", str),

    onConnect: () => {
      console.log("✅ WebSocket connected!");
      stompClient.subscribe(`/topic/alarm/${publicId}`, (message) => {
        console.log("📩 받은 알람:", JSON.parse(message.body));
        onMessageReceived(JSON.parse(message.body));
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
    },

    onWebSocketClose: () => {
      console.warn("⚠️ WebSocket closed, will reconnect...");
    },
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
    console.log("🔌 WebSocket disconnected");
  }
};
