import React, { useContext, useEffect, useState } from 'react';
import AlarmBell from './AlarmBell';
import AlarmDropdown from './AlarmDropdown';
import { AuthContext } from '../../../contexts/AuthContext';
import { connectSocket, disconnectSocket } from '../../../config/socket';
import api from "../../../config/apiConfig";

const AlarmSystem = () => {
    // 알림 전체 상태 관리 + WebSocket 연결
    const [alarms, setAlarms] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, loading  } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    
    // 기존 알람 목록 불러오기 (로그인 후)
    const fetchAlarms = async () => {
        try {
            const response = await api.post("/api/alarms", null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const alarmList = response.data.data || [];
            console.log("💢💌alarmList : ", alarmList);
            
            setAlarms(alarmList);
            setUnreadCount(alarmList.filter((a) => !a.state).length);

        } catch (error) {
            console.error("알람 목록 불러오기 실패:", error);
        } 
    }

    useEffect(() => {
        if (loading) return;
        if (!user?.publicId || !token) return;

        console.log("🚀 유저 로딩 완료:", user.publicId);
        fetchAlarms();

        connectSocket(token, user.publicId, (newAlarm) => {
            console.log("📨 새로운 알람 수신:", newAlarm);
            setAlarms((prev) => [newAlarm, ...prev]);
            setUnreadCount((prev) => prev + 1);
            setShowDropdown(true);
        });

        return () => {
            disconnectSocket();
        };
    }, [user?.publicId, loading, token]); // user.id, loading 변경 감지

    // 읽음 처리
    const handleAlarmClick = async (id) => {
        try {
            await api.patch(`/api/alarms/${id}/read`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updated = alarms.map((a) => 
                (a.id === id ? { ...a, state: true } : a)
            );
            setAlarms(updated);
            setUnreadCount(updated.filter((a) => !a.state).length);
        } catch (error) {
            console.error("알람 읽음 처리 실패:", error);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <AlarmBell 
                unreadCount={unreadCount}
                onClick={() => {
                    console.log("🔔 종 클릭됨!");
                    setShowDropdown(!showDropdown);
                }}
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