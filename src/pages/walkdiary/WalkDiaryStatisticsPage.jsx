import React from 'react';
import { Card } from "react-bootstrap";
import SummaryCards from '../../components/board/walkDiary/SummaryCards';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/walkdiary/WalkDiaryStatistics.css"
import WalkCharts from '../../components/board/walkDiary/WalkCharts';
import ReminderCard from '../../components/board/walkDiary/ReminderCard';

const WalkDiaryStatisticsPage = () => {
    return (
        <div className='row justify-content-center'>
            <Card className="mb-3 stat-box">
                <Card.Header>통계</Card.Header>
                <Card.Body>
                    {/* 이번 달 통계 요약 */}
                    <SummaryCards />

                    {/* 날짜별 그래프 */}
                    <WalkCharts />
                </Card.Body>
            </Card>

            {/* 동기 부여 메시지 */}
            <ReminderCard />
        </div>
    );
};

export default WalkDiaryStatisticsPage;