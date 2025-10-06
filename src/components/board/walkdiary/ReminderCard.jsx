import React from 'react';
import { Card } from 'react-bootstrap';

const ReminderCard = () => {
    return (
        <Card className="mb-3 text-center reminder-box">
            <Card.Body>
                {/* {isInactiveForWeek 
                    ? "이번 주는 아직 산책을 안했어요 😢" */}
                    : "저번 주보다 산책 시간이 더 늘었어요! 👏"
                {/* } */}
            </Card.Body>
        </Card>
    );
};

export default ReminderCard;