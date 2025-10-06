import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import pawImg from '../../../assets/image/calendar-paw.png';

const WalkDiaryCalendar = ({ onClickDate, dayList = []}, onMonthChange ) => {
    const [ value, setValue ] = useState(new Date());   // 클릭한 날짜 (초기값으로 현재 날짜 넣어줌

    const handleClickDay = (date) => {
        setValue(date);
        if (onClickDate) {
            onClickDate(dayjs(date));
        }
    };

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

    // const activeDate = value ? dayjs(value).format('YYYY-MM-DD') : '';   // 클릭한 날짜 (년-월-일)

    // // 현재 보여지는 달
    // const [activeMonth, setActiveMonth] = useState(dayjs(value).format('YYYY-MM'));

    // 현재 보여지는 달 변경 시 호출
    const getActiveMonth = (activeStartDate) => {
        if (!activeStartDate) {
            return; // undefined 방지
        }
        const date = dayjs(activeStartDate);
        if (onMonthChange) {
            onMonthChange(date.year(), date.month() + 1);
        }
    }

    return (
        <Card className="mb-4 calendar-box">
            <Card.Header className="card-header">
                <span>산책 일지</span>
            </Card.Header>
            <Card.Body>
                <div className='d-flex justify-content-end gap-2 mb-3 check-btn'>
                    <Link to="/walk-diaries/stats">
                        <Button className='stat-btn'>통계 확인</Button>
                    </Link>
                    <Button className='health-btn'  onClick={() => alert('AI 건강 체크는 현재 구현 중입니다.')}>AI 건강 체크</Button>
                </div>
                <Calendar 
                    onChange={setValue}
                    onClickDay={handleClickDay}
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