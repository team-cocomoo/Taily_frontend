import React from "react";
import { Modal, Button } from "react-bootstrap";
import naverIcon from "../../assets/image/naver-icon.png";
import gmailIcon from "../../assets/image/google-icon.png";

const ShareModal = ({ show, handleClose, postTitle, postUrl }) => {
  // ✅ 네이버 메일 공유
  const handleShareNaver = () => {
    const subject = encodeURIComponent(`[Taily] ${postTitle}`);
    const body = encodeURIComponent(`이 게시글을 공유합니다!\n\n${postUrl}`);
    const naverMailUrl = `https://mail.naver.com/write?subject=${subject}&body=${body}`;
    window.open(naverMailUrl, "_blank");
  };

  // ✅ Gmail 공유
  const handleShareGmail = () => {
    const subject = encodeURIComponent(`[Taily] ${postTitle}`);
    const body = encodeURIComponent(`이 게시글을 공유합니다!\n\n${postUrl}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>공유하기</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {/* ✅ 네이버 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleShareNaver}
          >
            <img
              src={naverIcon}
              alt="Naver"
              style={{ width: "60px", height: "60px" }}
            />
            <span style={{ marginTop: "8px", fontWeight: "500" }}>네이버</span>
          </div>

          {/* ✅ Gmail */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleShareGmail}
          >
            <img
              src={gmailIcon}
              alt="Gmail"
              style={{
                width: "60px",
                height: "60px",
              }}
            />
            <span style={{ marginTop: "8px", fontWeight: "500" }}>Gmail</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
