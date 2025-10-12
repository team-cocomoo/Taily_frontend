import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import reminderDog from "../../../assets/image/reminder_dog.png";

const ReminderCard = ({ stats }) => {
    if (!stats) return null;

    return (
        <Card className="mb-3 text-center reminder-box">
            <Card.Body>
                <Row className="d-flex justify-content-center align-items-center">
                <Col xs="auto">
                    <img
                    src={reminderDog}
                    alt="차트 리마인더"
                    style={{ width: 100, height: 100 }}
                    />
                </Col>
                <Col xs="auto" className="mt-4">
                    {stats.reminderMessage}
                    <div
                    style={{ borderBottom: "2px solid #4F1F02", margin: "10px 0" }}
                    ></div>
                </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ReminderCard;
