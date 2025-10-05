import React from "react";
import WalkDiaryDetailContent from "../../components/board/walkdiary/WalkDiaryDetailContent";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const WalkDiaryDetailPage = () => {
    const navigate = useNavigate();

    const startTime = "09:30";
    const endTime = "10:30";
    
    const diffMinutes = (new Date(`2025-10-05T${endTime}:00`) - new Date(`2025-10-05T${startTime}:00`)) / 1000 / 60;

    // 테스트용 더미 데이터
    const dummyPost = {
        date: "2025/10/05",
        weather: "☀️", 
        startTime,
        endTime,
        totalTime: `${diffMinutes / 60}시간`,
        emotion: "😍",
        content: "날오늘 날씨가 너무 좋았어요! 🐶\n공원에서 산책하고, 사진도 찍었어요.",
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-11">
                {/* 게시글 상세 */}
                <WalkDiaryDetailContent post={dummyPost} />

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
