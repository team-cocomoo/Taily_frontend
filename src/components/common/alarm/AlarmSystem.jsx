import React, { useContext, useEffect, useState } from 'react';
import AlarmBell from './AlarmBell';
import AlarmDropdown from './AlarmDropdown';
import { AuthContext } from '../../../contexts/AuthContext';
import { connectSocket, disconnectSocket } from '../../../config/socket';

const AlarmSystem = () => {
    // 알림 전체 상태 관리 + WebSocket 연결
    const [alarms, setAlarms] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, loading  } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    useEffect(() => {
        console.log("🔍 [AlarmSystem] useEffect 실행", user?.publicId, token);
        if (loading) return; // 아직 유저정보 로딩 중이면 대기
        if (!user?.publicId || !token) return; // 로그인 안된 경우 차단
        // webSocket 연결
        connectSocket(token, user.publicId, (newAlarm) => {
            console.log("📩 New Alarm:", newAlarm);
            setAlarms((prev) => [newAlarm, ...prev]);
            setUnreadCount((prev) => prev + 1);
            setShowDropdown(true);
        });

        // 언마운트 시 연결 해제
        return () => {
            disconnectSocket();
        };
    }, [user?.publicId, loading, token]); // ✅ user.id, loading 변경 감지

    // 읽음 처리
    const handleAlarmClick = (id) => {
        const updated = alarms.map((a) => 
            (a.id === id ? { ...a, state: true } : a)
        );
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