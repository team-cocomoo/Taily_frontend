import React from 'react';
import WalkDiaryCalendar from '../../components/board/walkdiary/WalkDiaryCalendar';

import "../../styles/walkdiary/WalkDiaryCalendar.css"

const WalkDiaryCalendarPage = () => {
    return (
        <div className='row justify-content-center'>
            {/* 캘린더 */}
            <WalkDiaryCalendar />
        </div>
    );
};

export default WalkDiaryCalendarPage;