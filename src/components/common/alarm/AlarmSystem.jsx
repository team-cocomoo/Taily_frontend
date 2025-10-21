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
            setAlarms(alarmList);
            setUnreadCount(alarmList.filter((a) => !a.state).length);

        } catch (error) {
            console.error("알람 목록 불러오기 실패:", error);
        } 
    }

    useEffect(() => {
        if (loading) return; // 아직 유저정보 로딩 중이면 대기
        if (!user?.publicId || !token) return; // 로그인 안된 경우 차단

        // DB에서 기존 알람 불러오기
        fetchAlarms();

        // webSocket 연결
        connectSocket(token, user.publicId, (newAlarm) => {
            setAlarms((prev) => [newAlarm, ...prev]);
            setUnreadCount((prev) => prev + 1);
            setShowDropdown(true);
        });

        // 언마운트 시 연결 해제
        return () => {
            disconnectSocket();
        };
    }, [user?.publicId, loading, token]); // user.id, loading 변경 감지

    useEffect(() => {
        if (showDropdown) {
            alarms.forEach((a) => !a.state && handleAlarmClick(a.id));
        }
    }, [showDropdown]); // showDropdown이 true로 바뀔 때만 실행됨

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