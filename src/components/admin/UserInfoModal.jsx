import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import paw from '../../assets/image/calendar-paw.png';

const UserInfoModal = ({ show, user, handleClose }) => {
    if (!user) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>회원 상세 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <img
                            src={paw}
                            alt="프로필"
                            style={{ maxWidth: "100%" }}
                        />
                    </Col>
                    <Col>
                        <p>
                        <strong>아이디:</strong> {user.username}
                        </p>
                        <p>
                        <strong>닉네임:</strong> {user.nickname}
                        </p>
                        <p>
                        <strong>이메일:</strong> {user.email}
                        </p>
                        <p>
                        <strong>가입일:</strong> {user.createdAt}
                        </p>
                        <p>
                        <strong>상태:</strong> {user.state}
                        </p>
                        <p>
                        <strong>제재 횟수:</strong> {user.sanctionCount}
                        </p>
                        {user.sanctionCount > 0 && (
                        <p>
                            <strong>제재 기간:</strong>{" "}
                            {user.penaltyStartDate ?? "-"} ~ {user.penaltyEndDate ?? "-"}
                        </p>
                        )}

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
