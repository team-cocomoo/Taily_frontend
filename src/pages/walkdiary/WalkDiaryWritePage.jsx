import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WalkDiaryInfo from "../../components/board/walkDiary/WalkDiaryInfo";
import WalkeDiaryContent from "../../components/board/walkDiary/WalkeDiaryContent";
import ImageBox from "../../components/board/ImageBox";

import "../../styles/walkDiary/WalkDiaryWrite.css";
import api from "../../config/apiConfig";

const WalkDiardWritePage = () => {
  const navigate = useNavigate();
  const { date } = useParams();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    date: "",
    walkDiaryWeather: "SUNNY",
    walkDiaryEmotion: "LOVE",
    content: "",
    beginTime: "",
    endTime: "",
  });

  const [images, setImages] = useState([]); // 최대 3장,  이미지 파일 상태
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) setFormData((prev) => ({ ...prev, date}));
  }, [date]);

  // 입력 변경 처리
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // 입력 시 에러 메시지 초기화
    if (error) setError("");
  };

  // 작성 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const token = localStorage.getItem("accessToken");

    try {
      const payload = { ...formData, images }; // images는 JSON DTO 배열
      const response = await api.post(`/api/walk-diaries/write/${date}`, 
          payload, 
          {
              headers: {
                  Authorization: token ? `Bearer ${token}` : ""
              }
      });

      if (response.data.success) {
        alert("산책 일지가 작성되었습니다!");
        navigate(`/api/walk-diaries/${date}`);
      }
    } catch (error) {
      console.error("작성 중 오류: ", error);
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row justify-content-center">
      {/* 오늘의 정보 card */}
      <WalkDiaryInfo onChange={handleChange} values={formData} />

      {/* 오늘의 일기 */}
      <WalkeDiaryContent onChange={handleChange} values={formData} />

      {/* 사진 첨부 */}
      <ImageBox onImageChange={setImages} />

      {error && <p className="text-danger text-center mt-2">{error}</p>}

      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="secondary" onClick={() => navigate("/walk-diaries")}>
          목록
        </Button>
        {/* type=submit */}
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "작성 중..." : "작성완료"}
        </Button>
      </div>
    </div>
  );
};

export default WalkDiardWritePage;
