import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WalkDiaryInfo from "../../components/board/walkdiary/WalkDiaryInfo";
import WalkeDiaryContent from "../../components/board/walkdiary/WalkeDiaryContent";
import ImageBox from "../../components/board/ImageBox";

import "../../styles/walkdiary/WalkDiaryWrite.css"

const WalkDiardWritePage = () => {
    const navigate = useNavigate();

    return (
        <div className="row justify-content-center">
            {/* 오늘의 정보 card */}
            <WalkDiaryInfo />

            {/* 오늘의 일기 */}
            <WalkeDiaryContent />

            {/* 사진 첨부 */}
            <ImageBox />

            <div className="d-flex justify-content-center gap-2 mt-3">
                <Button variant="secondary" onClick={() => navigate("/")}>목록</Button>
                {/* type=submit */}
                {/* <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "작성 중..." : "작성완료"}
                </Button> */}
                <Button variant="primary">완료</Button>
            </div>
        </div>
    );
};

export default WalkDiardWritePage;
