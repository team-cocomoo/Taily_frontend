import React, { useEffect, useRef } from 'react';
import { Stack, Badge } from 'react-bootstrap';
import { Heart, MessageCircle, MessagesSquare, UserPlus } from 'lucide-react';
import "../../../styles/AlarmDropdown.css";
import { useNavigate } from 'react-router-dom';

const AlarmDropdown = ({ alarms, onClickAlarm, setShowDropdown }) => {
    // 알림 목록 UI (드롭다운 스타일)
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      // 알람 벨 클릭으로 인한 닫힘 방지
      if (e.target.closest(".alarm-bell")) return;
      setShowDropdown(false);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
    }, [setShowDropdown]);

    // 날짜 포맷 함수
    const formatDateGroup = (dateStr) => {
        const today = new Date();
        const date = new Date(dateStr);
        const diff = (today - date) / (1000 * 60 * 60 * 24);
        if (diff < 1) return "오늘";
        if (diff < 2) return "어제";
        return `${Math.floor(diff)}일 전`;
    };

    // 아이콘 + 문장 구성 (백엔드에서 content 완성해서 줌)
  const getAlarmContent = (alarm) => {
    let icon;
    switch (alarm.alarmCategory) {
      case "LIKE":
        icon = <Heart size={22} color="#ff4d6d" fill="#ff4d6d" />;
        break;
      case "COMMENT":
        icon = <MessageCircle size={22} color="#3b82f6" />;
        break;
      case "FOLLOW":
        icon = <UserPlus size={22} color="#22c55e" />;
        break;
      case "CHATTING":
        icon = <MessagesSquare size={22} color="#e3c43dff" />;
        break;
      default:
        icon = <Heart size={22} color="#aaa" />;
        break;
    }

    return {
      icon,
      text: (
        <>
            <strong>{alarm.senderNickname}</strong>
          {alarm.content}
        </>
      ),
    };
  };

    // 게시글 이동 핸들러
    const handleNavigate = (alarm) => {
        onClickAlarm(alarm.id); // 읽음 처리 먼저

        // FOLLOW 알람일 경우
        if (alarm.alarmCategory === "FOLLOW") {
            navigate(`/user-profile/${alarm.senderId}/profile`);
            setShowDropdown(false);
            return; // 여기서 끝내기
        } else if (alarm.alarmCategory === "CHATTING") {
            navigate(`/chats/${alarm.senderId}`);
            setShowDropdown(false);
            return; // 여기서 끝내기
        }

        const category = alarm.tableTypeCategory?.toLowerCase();

        if (category.includes("피드") || category.includes("feed")) {
          navigate(`/petstory/feed/${alarm.postsId}`);
        } else if (category.includes("다함께산책") || category.includes("walk")) {
          navigate(`/walk-paths/${alarm.postsId}`);
        } else if (category.includes("테일리프렌즈") || category.includes("taily")) {
          navigate(`/taily-friends/${alarm.postsId}`);
        } else {
          navigate(`/posts/${alarm.postsId}`);
        }

        setShowDropdown(false); // 이동 시 드롭다운 닫기
    };

    // 날짜별 그룹화
  const grouped = (Array.isArray(alarms) ? alarms : []).reduce((acc, alarm) => {
    const group = formatDateGroup(alarm.createdAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(alarm);
    return acc;
  }, {});

    return (
        <div className='alarm-dropdown shadow-sm' ref={dropdownRef}>
            {alarms.length === 0 ? (
                <div className='empty'>알림이 없습니다.</div>
            ) : (
          Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <div className="alarm-date">{group}</div>
            {items.map((alarm) => {
              const { icon, text } = getAlarmContent(alarm);
              return (
                <Stack
                  key={alarm.id}
                  direction="horizontal"
                  gap={3}
                  className={`p-3 border message-box align-items-center hover-effect mb-1 ${
                    alarm.state ? "read" : "unread"
                  }`}
                  onClick={() => handleNavigate(alarm)}
                >
                  <div
                    className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm"
                    style={{ width: 50, height: 36 }}
                  >
                    {icon}
                  </div>
                  <div
                    className="flex-grow-1 clickable"
                    onClick={() => onClickAlarm && onClickAlarm(alarm.id)}
                  >
                    <div>{text}</div>
                    <small className="alarm-time">
                      {new Date(alarm.createdAt).toLocaleString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                  <Badge className="table-type-category">
                    {alarm.tableTypeCategory || "기타"}
                  </Badge>
                </Stack>
              );
            })}
          </div>
        ))
            )}
        </div>
    );
};

export default AlarmDropdown;