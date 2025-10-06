import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import pawImg from '../../../assets/image/calendar-paw.png';

const WalkDiaryCalendar = () => {
    const [ value, setValue ] = useState(new Date());   // 클릭한 날짜 (초기값으로 현재 날짜 넣어줌
    const activeDate = value ? dayjs(value).format('YYYY-MM-DD') : '';   // 클릭한 날짜 (년-월-일)

    // 현재 보여지는 달
    const [activeMonth, setActiveMonth] = useState(dayjs(value).format('YYYY-MM'));

    // 현재 보여지는 달 변경 시 호출
    const getActiveMonth = (activeStartDate) => {
        if (!activeStartDate) {
            return; // undefined 방지
        }
        setActiveMonth(dayjs(activeStartDate).format('YYYY-MM'));
    }

    // 일기 작성 날짜 리스트
    const dayList = [
        '2025-09-20',
        '2025-09-28',
        '2025-10-01',
        '2025-10-04',
        '2025-10-06',
    ];

    // 각 날짜 타일에 컨텐츠 추가
    const addContent = ({ date }) => {
        const formatted = dayjs(date).format('YYYY-MM-DD');
        const hasDiary = dayList.includes(formatted);

        return hasDiary ? (
            <img 
                src={pawImg}
                className='diaryImg'
                width={26}
                height={26}
                alt='today is...'
            />
        ) : null;

        
    };

    return (
        <Card className="mb-4 calendar-box">
            <Card.Header className="card-header">
                <span>산책 일지</span>
            </Card.Header>
            <Card.Body>
                <div className='d-flex justify-content-end gap-2 mb-3 check-btn'>
                    <Button className='stat-btn' onClick={() => navigator("/")}>통계 확인</Button>
                    <Button className='health-btn'>AI 건강 체크</Button>
                </div>
                <Calendar 
                    onChange={setValue}
                    value={value} 
                    locale='en-US' 
                    next2Label={null}
                    prev2Label={null}
                    formatDay={(locale, date) => dayjs(date).format('D')}
                    tileContent={addContent}
                    showNeighboringMonth={false}
                    onActiveStartDateChange={(args) => {
                        if (args?.activeStartDate) getActiveMonth(args.activeStartDate);
                    }}
                />
            </Card.Body>
        </Card>
    );
};

export default WalkDiaryCalendar;