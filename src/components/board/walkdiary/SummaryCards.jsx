import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const SummaryCards = ({ stats }) => {
    if (!stats) return null; // stats가 아직 안 들어왔을 때 렌더 방지

    return (
        <Row className='box-container'>
            <Col>
                <Card className='box'>
                    <div className='chart-header'>총 산책 수</div>
                    <Card.Body>
                        <h1>{stats.totalWalks}</h1> 번
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className='box'>
                    <div className='chart-header'>평균 산책 시간</div>
                    <Card.Body>
                        <h1>{stats.avgDurationMinutes}</h1> 시간
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card className='box'>
                    <div className='chart-header'>연속 산책 일수</div>
                    <Card.Body>
                        <h1>{stats.streakDays}</h1> 일 <span>연속 산책 중!</span>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        
    );
};

export default SummaryCards;