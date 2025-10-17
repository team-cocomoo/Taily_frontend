import React, { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import inquiryDog from "../../assets/image/inquiry-dog.png";
import InquiryModal from "./InquiryModal";

const Inquiries = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="mt-3 inquiries-card">
        <Row className="m-0 p-1 align-items-center flex-nowrap contents-card">
          <Col>
            <h6 style={{ fontWeight: "bolder" }}>
              질문에 대한 답을 찾지 못하셨나요?
            </h6>
            <Button
              className="inquiry-btn mt-3"
              onClick={() => setShowModal(true)}
            >
              1:1문의 하기
            </Button>
          </Col>
          <Col>
            <img className="image-area" src={inquiryDog} alt="" />
          </Col>
        </Row>
      </Card>

      <InquiryModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default Inquiries;
