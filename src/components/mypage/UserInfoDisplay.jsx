// src/components/UserInfoDisplay.js
import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";

// 이 데이터는 실제로는 API를 통해 가져와야 합니다.
const defaultUserInfo = {
  id: "Lamb0123",
  tel: "010-1111-2332",
  email: "tmtn123@gmail.com",
  address: "서울특별시 금천구 독산동",
  intro: "취미와 특성을 잘 표현해 줍니다.",
  birthday: "1995-05-15",
};

const UserInfoDisplay = ({ userInfo = defaultUserInfo }) => {
  const DisplayItem = ({ label, value, showEditIcon = true }) => (
    <Form.Group as={Row} className="mb-3 align-items-center">
      <Form.Label column sm="2" className="text-secondary">
        {label}
      </Form.Label>
      <Col sm="10" className="d-flex align-items-center">
        <Form.Control
          plaintext
          readOnly
          defaultValue={value}
          className="fw-bold"
          {...(label === "소개" ? { as: "textarea", rows: 2 } : {})}
        />
        {/* 여기 버튼 완전히 제거해도 구조는 유지됨 */}
      </Col>
    </Form.Group>
  );

  return (
    <Card className="p-4 border-0">
      <Form>
        <DisplayItem label="아이디" value={userInfo.id} showEditIcon={false} />
        <DisplayItem label="TEL" value={userInfo.tel} />
        <DisplayItem label="이메일" value={userInfo.email} />
        <DisplayItem label="주소" value={userInfo.address} />
        <DisplayItem label="소개" value={userInfo.intro} />

        {/* 이미지와 동일한 버튼 레이아웃
                <div className="d-flex justify-content-end mt-4">
                    <Button 
                        variant="outline-secondary" 
                        className="me-3"
                        onClick={() => console.log('수정 취소 버튼 클릭')}
                    >
                        수정 취소
                    </Button>
                    <Button 
                        variant="warning" 
                        onClick={() => console.log('수정 완료 버튼 클릭')}
                    >
                        수정 완료
                    </Button>
                </div> */}
      </Form>
    </Card>
  );
};

export default UserInfoDisplay;
