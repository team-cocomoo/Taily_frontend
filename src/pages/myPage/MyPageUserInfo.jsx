// src/components/UserInfoDisplay.js
import React from 'react';
import { Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
// 아이콘 (선택 사항)
import { EnvelopeFill, PhoneFill, GeoAltFill } from 'react-bootstrap-icons'; 

const MyPageUserInfo = ({ userInfo }) => {

    // 아이디를 읽기 전용으로 표시하는 함수
    const DisplayField = ({ label, value, icon: Icon, textMuted }) => (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2" className="text-secondary fw-bold">
                {label}
            </Form.Label>
            <Col sm="10">

                <InputGroup>
                    {Icon && <InputGroup.Text>{<Icon />}</InputGroup.Text>}
                    {/* plaintext와 readOnly를 사용하여 깔끔한 읽기 전용 텍스트로 표시 */}
                    <Form.Control 
                        plaintext 
                        readOnly 
                        defaultValue={value} 
                        // 소개글처럼 여러 줄일 경우 as="textarea" 적용
                        {...(label === "소개" ? { as: "textarea", rows: 2 } : {})}
                    />
                </InputGroup>
                {textMuted && <Form.Text className="text-muted">{textMuted}</Form.Text>}
            </Col>
        </Form.Group>
    );

    return (
        <Card className="p-4 border-0">
            <Form>
                
                {/* 아이디 */}
                <DisplayField label="아이디" value={userInfo.id} />

                {/* 전화번호 (TEL) */}
                <DisplayField label="TEL" value={userInfo.tel} icon={PhoneFill} />

                {/* 이메일 */}
                <DisplayField label="이메일" value={userInfo.email} icon={EnvelopeFill} />

                {/* 주소 */}
                <DisplayField 
                    label="주소" 
                    value={userInfo.address} 
                    icon={GeoAltFill} 
                    textMuted="체크된 주소는 매월 정산 시 이용됩니다."
                />

                {/* 소개 */}
                <DisplayField label="소개" value={userInfo.intro} />
                
                {/* 생년월일 (예시 항목) */}
                <DisplayField label="생년월일" value={userInfo.birthday} />

                {/* 수정 버튼만 표시 (조회 페이지에서 수정 페이지로 이동하는 역할) */}
                <div className="d-flex justify-content-end mt-4">
                    <Button 
                        variant="warning" 
                        // TODO: 실제 구현 시 수정 페이지로 라우팅하는 로직 추가
                        onClick={() => console.log('수정 페이지로 이동')}
                    >
                        수정하기
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default MyPageUserInfo;