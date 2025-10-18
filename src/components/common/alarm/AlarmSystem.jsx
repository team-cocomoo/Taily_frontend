import React, { useContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from 'stompjs';
import AlarmBell from './AlarmBell';
import AlarmDropdown from './AlarmDropdown';
import { AuthContext } from '../../../contexts/AuthContext';

const AlarmSystem = () => {
    // 알림 전체 상태 관리 + WebSocket 연결
    const [alarms, setAlarms] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useContext(AuthContext);
    const clientRef = useRef(null);

    const token = localStorage.getItem("token");

    // webSocket 연결
    useEffect(() => {
        if (!user.id) return;
        const socket = new SockJS("/ws-chat");  // 백엔드 엔드포인트
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,   // 자동 재연결
            debug: (str) => console.log("STOMP: ", str),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log("Alarm WebSocket connected");
                
                client.subscribe(`/topic/alarm/${user.id}`, (message) => {
                    const newAlarm = JSON.parse(message.body);
                    console.log("📩 New Alarm:", newAlarm);

                    setAlarms((prev) => [newAlarm, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                });
            },
            onWebSocketClose: () => console.warn("⚠️ WebSocket closed"),
            onStompError: (frame) => console.error("❌ STOMP error:", frame),
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [user.id, token]);

    // 읽음 처리
    const handleAlarmClick = (id) => {
        const updated = alarms.map((a) => (a.id === id ? { ...a, state: true } : a));
        setAlarms(updated);
        setUnreadCount(updated.filter((a) => !a.state).length);
    }

    return (
        <div style={{ position: "relative" }}>
            <AlarmBell 
                unreadCount={unreadCount}
                onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
                <AlarmDropdown 
                    alarms={alarms}
                    onClickAlarm={handleAlarmClick}
                    setShowDropdown={setShowDropdown}
                />
            )}
        </div>
    );
};

export default AlarmSystem;