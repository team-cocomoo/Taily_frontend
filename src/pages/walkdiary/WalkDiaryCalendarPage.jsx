import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import WalkDiaryCalendar from '../../components/board/walkDiary/WalkDiaryCalendar.jsx';
import api from '../../config/apiConfig.js';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "../../styles/walkdiary/WalkDiaryCalendar.css"

const WalkDiaryCalendarPage = () => {
    const navigate = useNavigate();
    const [walkDiaries, setWalkDiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeYear, setActiveYear] = useState(dayjs().year());
    const [activeMonth, setActiveMonth] = useState(dayjs().month() + 1); // month는 0~11


    const fetchWalkDiaries = async (year, month) => {
        const token = localStorage.getItem("accessToken");
        setLoading(true);

        try {
            const response = await api.get("/api/walk-diaries", {
                params: { year, month },
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (response.data.success) {
                setWalkDiaries(response.data.data); 
            }
        } catch (error) {
            console.error("산책 일지 목록 조회 실패:", error);
        } finally {
            setLoading(false);
        };
    }

    // 컴포넌트 마운트 시 + activeYear/Month 변경 시 호출
    useEffect(() => {
        fetchWalkDiaries(activeYear, activeMonth);
    }, [activeYear, activeMonth]);

    const handleClickDate = async (date) => {
        const formatted = dayjs(date).format('YYYY-MM-DD');
        const token = localStorage.getItem("accessToken"); // 토큰 가져오기

        try {
            const response = await api.get("/api/walk-diaries/check", {
                params: { date: formatted },
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (response.data.exists) {
                navigate(`/api/walk-diaries/${formatted}`);
            } else {
                // 산책 일지 작성 API 호출
                const res = await api.post(`/api/walk-diaries/write/${formatted}`, 
                    {date: formatted}, 
                    {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : ""
                        }
                });

                if (res.data.success) {
                    navigate(`/api/walk-diaries/${formatted}`);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 로딩 중 일 때
    if (loading) {
        return <LoadingSpinner message="산책 일지를 불러오는 중..."></LoadingSpinner>;
    }

    return (
        <div className='row justify-content-center'>
            {/* 캘린더 */}
            <WalkDiaryCalendar 
                onClickDate={handleClickDate} 
                dayList={walkDiaries}   // 날짜 리스트 props로 전달
                onMonthChange={(year, month) => {
                    setActiveYear(year);
                    setActiveMonth(month);
                }}
            />
        </div>
    );
};

export default WalkDiaryCalendarPage;