import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const WalkCharts = ({ stats }) => {
    console.log("WalkCharts stats:", stats); // 이거 찍히는지 확인

    if (!stats || !stats.dailyStat || stats.dailyStat.length === 0) {
        console.log("WalkCharts 렌더링 없음 - 데이터 없음");
        return null;
    }

    const generateMonthChartData = (dailyStat) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0~11
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); // 이번 달 마지막 날

        const statsMap = new Map();
        dailyStat.forEach(item => {
            statsMap.set(item.date, item.durationMinutes);
        });

        const chartData = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().slice(0, 10); // yyyy-mm-dd
            chartData.push({
                date: dateStr.slice(5), // MM-DD
                minutes: statsMap.get(dateStr) || 0,
            });
        }

        return chartData;
    };

    // dailyStats를 recharts용 데이터로 변환
    const chartData = generateMonthChartData(stats.dailyStat);
    console.log("chartData:", chartData);
    
    return (
        <Card>
            <Card.Header>날짜별 산책 시간</Card.Header>
            <Card.Body style={{ height: 300, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis label={{ value: '분', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#4F1F02" />
                </BarChart>
                </ResponsiveContainer>
            </Card.Body>
        </Card>
    );
};

export default WalkCharts;