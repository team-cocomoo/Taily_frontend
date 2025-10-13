import React from "react";
import { Button, Modal } from "react-bootstrap";

const UserInfoModal = ({ show, user, handleClose }) => {
    if (!user) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>회원 상세 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
