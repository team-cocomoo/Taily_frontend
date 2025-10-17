import { Bell } from 'lucide-react';
import React from 'react';
import { Badge } from 'react-bootstrap';

const AlarmBell = ({ unreadCount, onClick }) => {
    // 종 아이콘 + 안 읽은 개수 배지
    return (
        <div
            style={{ position: "relative", cursor: "pointer", display: "inline-block" }} 
            onClick={onClick}
        >
            <Bell size={22} />
            {unreadCount > 0 && (
                <Badge
                    bg='danger'
                    pill
                    className='position-absolute top-0 start-100 translate-middle'
                    style={{ fontSize: "10px" }}
                >
                    {unreadCount}
                </Badge>
            )}
        </div>
    );
};

export default AlarmBell;