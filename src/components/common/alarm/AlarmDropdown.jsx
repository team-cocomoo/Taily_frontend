import React, { useEffect, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';
import "../../../styles/AlarmDropdown.css";

const AlarmDropdown = ({ alarms, onClickAlarm, setShowDropdown }) => {
    // 알림 목록 UI (드롭다운 스타일)
    const dropdownRef = useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowDropdown]);

    return (
        <div className='alarm-dropdown' ref={dropdownRef}>
            {alarms.length === 0 ? (
                <div className='empty'>알림이 없습니다.</div>
            ) : (
                <ListGroup variant='flush'>
                    {alarms.map((alarm) => (
                        <ListGroup.Item
                            key={alarm.id}
                            action
                            onClick={() => onClickAlarm(alarm.id)}
                            className={alarm.state ? "read" : "unread"}
                        >
                            <strong>{alarm.sender}</strong> {alarm.content}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default AlarmDropdown;