import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import WalkDiaryCalendar from "../../components/board/walkDiary/WalkDiaryCalendar.jsx";
import api from "../../config/apiConfig.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import "../../styles/walkdiary/WalkDiaryCalendar.css";

const WalkDiaryCalendarPage = () => {
  const navigate = useNavigate();
  const [walkDiaries, setWalkDiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeYear, setActiveYear] = useState(dayjs().year());
  const [activeMonth, setActiveMonth] = useState(dayjs().month() + 1); // month는 0~11

  // 산책 일지 목록 조회
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
        console.log("walkDiaries", response.data.data);
        setWalkDiaries(response.data.data);
      }
    } catch (error) {
      console.error("산책 일지 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 + activeYear/Month 변경 시 호출
  useEffect(() => {
    fetchWalkDiaries(activeYear, activeMonth);
  }, [activeYear, activeMonth]);

  // 날짜 클릭 핸들러
  const handleClickDate = async (date) => {
    // const formatted = dayjs(date).format('YYYY-MM-DD');
    const formatted = date.format
      ? date.format("YYYY-MM-DD")
      : dayjs(date).format("YYYY-MM-DD");

    // 날짜와 매칭되는 walkDiary 찾기
    const diary = walkDiaries.find((d) => d.date === formatted);
    console.log("diary" + diary);
    if (diary) {
      // 상세보기: ID 기반
      navigate(`/walk-diaries/${diary.id}`);
    } else {
      // 작성 페이지: 날짜 기반
      navigate(`/walk-diaries/write/${formatted}`);
    }
  };

  // 로딩 중 일 때
  if (loading) {
    return (
      <LoadingSpinner message="산책 일지를 불러오는 중..."></LoadingSpinner>
    );
  }

  return (
    <div className="row justify-content-center">
      {/* 캘린더 */}
      <WalkDiaryCalendar
        onClickDate={handleClickDate}
        dayList={walkDiaries} // 날짜 리스트 props로 전달
        onMonthChange={(year, month) => {
          setActiveYear(year);
          setActiveMonth(month);
        }}
      />
    </div>
  );
};

export default WalkDiaryCalendarPage;
