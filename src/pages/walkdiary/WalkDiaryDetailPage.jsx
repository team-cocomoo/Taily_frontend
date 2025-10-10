import React, { useEffect, useState } from "react";
import WalkDiaryDetailContent from "../../components/board/walkdiary/WalkDiaryDetailContent";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const WalkDiaryDetailPage = () => {
    const navigate = useNavigate();
    const { date } = useParams();
    const [walkDiary, setWalkDiary] = useState(null);
    const [loading, setLoading] = useState(true);

    // 시간 포맷 (HH:mm:ss → HH:mm)
    const formatTime = (time) => (time ? time.slice(0, 5) : "");

    useEffect(() => {
        const fetchDiaryDetail = async () => {
        const token = localStorage.getItem("accessToken");
        // setLoading(true);
        try {
            const response = await api.get(`/api/walk-diaries/${date}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (response.data.success) {
            const data = response.data.data;
            console.log("이미지 데이터:", data.images);

            // 🧠 서버 DTO에 맞게 필드명 변환
            const formatted = {
                date: data.date,
                walkDiaryWeather: data.walkDiaryWeather,
                beginTime: formatTime(data.beginTime),
                endTime: formatTime(data.endTime),
                totalTime: getDiffTime(data.beginTime, data.endTime),
                walkDiaryEmotion: data.walkDiaryEmotion,
                content: data.content,
                petName: data.petName ?? "테일리", // 없으면 기본값
                images: data.images ?? [],
            };

            setWalkDiary(formatted);
            }
        } catch (error) {
            console.error("상세 조회 실패:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchDiaryDetail();
    }, [date]);

    const getDiffTime = (start, end) => {
        if (!start || !end) return "";
        const beginTime = new Date(`2025-10-05T${start}`);
        const endTime = new Date(`2025-10-05T${end}`);
        const diffMin = (endTime - beginTime) / 1000 / 60;
        const hours = Math.floor(diffMin / 60);
        return `${hours > 0 ? `${hours}시간` : ""}`;
    };

    if (loading) return <LoadingSpinner message="산책 일지를 불러오는 중..." />;

    if (!walkDiary)
        return (
        <div className="text-center mt-5">
            <p>존재하지 않는 산책 일지입니다.</p>
            <Button variant="primary" onClick={() => navigate("/")}>
            돌아가기
            </Button>
        </div>
        );

    return (
        <div className="row justify-content-center">
        <div className="col-md-11">
            {/* 게시글 상세 */}
            <WalkDiaryDetailContent walkDiary={walkDiary} />

            {/* 하단 버튼 */}
            <div className="d-flex justify-content-end mt-1 mb-4">
            <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate("/")}
            >
                목록
            </Button>
            </div>
        </div>
        </div>
    );
};

export default WalkDiaryDetailPage;
