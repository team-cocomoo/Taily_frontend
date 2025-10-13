import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import dog from '../../assets/image/reminder_dog.png';

const Inquiries = () => {
    return (
        <Card className='mt-3 inquiries-card'>
            <Row className='m-0 p-4 align-items-center'>
                <Col>
                    <h5 style={{fontWeight:"bolder"}}>질문에 대한 답을 찾지 못하셨나요?</h5>
                    <Button className='inquiry-btn mt-3'>1:1문의 하기</Button>
                </Col>
                <Col>
                    <img src={dog} alt="" />
                </Col>
            </Row>
            
        </Card>
    );
};

export default Inquiries;