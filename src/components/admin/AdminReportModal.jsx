import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AdminReportModal = ({ show, handleClose, report, onSuspendUser }) => {
  const [days, setDays] = useState(1); // 기본 제재 일수 1일

  if (!report) return null;

  const handleSuspend = () => {
    if (onSuspendUser) {
      onSuspendUser(report.reportedId, days); // 부모 컴포넌트에서 처리
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>신고 상세보기</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "1rem" }}>
        {/* 신고 정보 */}
        <div style={{ marginBottom: "10px" }}>
          <p><strong>신고자:</strong> {report.reporterNickname}</p>
          <p><strong>피신고자:</strong> {report.reportedNickname}</p>
          <p><strong>생성일:</strong> {new Date(report.createdAt).toLocaleDateString("ko-KR")}</p>
          <p><strong>상태:</strong> {report.state === "PENDING" ? "처리 전" : "처리 완료"}</p>
        </div>
        <hr />

        {/* iframe */}
        <div style={{ height: "400px", marginBottom: "1rem" }}>
          <iframe
            src={report.path}
            title="Report Content"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </div>

        {/* 유저 제재 */}
        <div style={{ marginTop: "1rem" }}>
          <Form.Group className="mb-2" controlId="suspendDays">
            <Form.Label>제재 일수</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
            <Form.Text className="text-muted">
              0일 입력 시 제재 없이 신고만 처리됩니다.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={handleSuspend}>
            제재 적용
          </Button>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdminReportModal;
