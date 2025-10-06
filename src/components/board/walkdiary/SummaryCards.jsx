import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const SummaryCards = () => {
    return (
        <Row className='box-container'>
            <Col>
                <Card className='box'>
                    <div className='chart-header'>총 산책 수</div>
                    <Card.Body>
                        <h1>20</h1> 번
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className='box'>
                    <div className='chart-header'>평균 산책 시간</div>
                    <Card.Body>
                        <h1>1</h1> 시간
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className='box'>
                    <div className='chart-header'>연속 산책 일수</div>
                    <Card.Body>
                        <h1>3</h1> 일 <br/>연속 산책 중!
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        
    );
};

export default SummaryCards;