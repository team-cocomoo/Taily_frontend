import React from "react";
import { Button, Col, Modal, Row, Card, Badge } from "react-bootstrap";
import paw from "../../assets/image/calendar-paw.png";
import "../../styles/admin/AdminUsers.css";
import SecureImage from "@/components/common/SecureImage";

const UserInfoModal = ({ show, user, handleClose }) => {
    if (!user) return null;
    console.log("선택된 user", user);

    return (
        <Modal show={show} onHide={handleClose} centered size="md" className="user-info-modal">
        <Modal.Header closeButton>
            <Modal.Title className="fw-bold">👤 회원 상세 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row className="align-items-center">
                <Col md={4} className="text-center">
                    {user.imagePath ? (
                        <SecureImage
                            src={user.imagePath.startsWith("http") ? user.imagePath : `http://localhost:8080${user.imagePath}`}
                            alt={`${user.nickname} 프로필`}
                            className="user-profile-img rounded-circle shadow-sm mb-3"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                    ) : (
                        <img
                            src={paw}
                            alt="기본 프로필"
                            className="user-profile-img rounded-circle shadow-sm mb-3"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                    )}

                        <Badge bg={user.state === "ACTIVE" ? "success" : "secondary"}>
                            {user.state === "ACTIVE" ? "활동 중" : "비활성"}
                        </Badge>
                    </Col>

            <Col md={8}>
                <Card className="info-card shadow-sm border-0">
                <Card.Body>
                    <div className="info-row">
                    <strong>아이디</strong>
                    <span>{user.username}</span>
                    </div>
                    <div className="info-row">
                    <strong>닉네임</strong>
                    <span>{user.nickname}</span>
                    </div>
                    <div className="info-row">
                    <strong>이메일</strong>
                    <span>{user.email}</span>
                    </div>
                    <div className="info-row">
                    <strong>가입일</strong>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="info-row">
                    <strong>제재 횟수</strong>
                    <span>{user.sanctionCount}</span>
                    </div>

                    {user.sanctionCount > 0 && (
                    <div className="info-row text-danger">
                        <strong>제재 기간</strong>
                        <span>
                        {user.penaltyStartDate ?? "-"} ~ {user.penaltyEndDate ?? "-"}
                        </span>
                    </div>
                    )}
                </Card.Body>
                </Card>
            </Col>
            </Row>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            닫기
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default UserInfoModal;
