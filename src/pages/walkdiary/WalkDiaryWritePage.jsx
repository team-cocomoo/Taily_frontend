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
  let name, value;

  if (e.target) {
    // 실제 이벤트 객체인 경우
    name = e.target.name;
    value = e.target.value;
  } else {
    // 직접 만든 객체인 경우
    name = e.name || e.target?.name;
    value = e.value || e.target?.value;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value || "",
  }));

  if (error) setError("");
};

  // 작성 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const token = localStorage.getItem("accessToken");

    try {
      // FormData 객체 생성
      const formDataToSend = new FormData();

      // 일반 필드 추가
      formDataToSend.append("date", formData.date);
      formDataToSend.append("walkDiaryWeather", formData.walkDiaryWeather || "SUNNY");
      formDataToSend.append("beginTime", formData.beginTime);
      formDataToSend.append("endTime", formData.endTime);
      formDataToSend.append("walkDiaryEmotion", formData.walkDiaryEmotion || "LOVE");
      formDataToSend.append("content", formData.content || "");

      // 이미지 파일 추가
      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // 요청 보내기
      const response = await api.post(`/api/walk-diaries/write/${date}`, 
          formDataToSend, 
          {
              headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                  "Content-Type": undefined // axios가 자동으로 multipart/form-data 지정
              }
      });

      if (response.data.success) {
        alert("산책 일지가 작성되었습니다!");
        navigate(`/api/walk-diaries`);
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
