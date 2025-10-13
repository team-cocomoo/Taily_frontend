import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const ReportModal = ({ show, handleClose, reportedId, path }) => {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext); // Context에서 로그인 유저 정보 가져오기

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      // axios POST 요청
      await axios.post(
        "http://localhost:8080/api/reports",
        {
          reportedId,
          path,
          content,
          reporterPublicId: user?.publicId, // context에서 가져온 publicId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("신고가 완료되었습니다.");
      handleClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("신고 실패");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>신고하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>신고 내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="신고 사유를 입력하세요"
              style={{
                height: "100px", 
                resize: "none", 
                overflowY: "auto", 
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          신고
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;
