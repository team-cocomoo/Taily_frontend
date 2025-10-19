import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WalkDiaryInfo from "../../components/board/walkDiary/WalkDiaryInfo";
import WalkeDiaryContent from "../../components/board/walkDiary/WalkeDiaryContent";
import ImageBox from "../../components/board/ImageBox";

import "../../styles/walkdiary/WalkDiaryWrite.css";
import api from "../../config/apiConfig";

const WalkDiaryUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: "",
    walkDiaryWeather: "SUNNY",
    walkDiaryEmotion: "LOVE",
    beginTime: "",
    endTime: "",
    content: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 기존 산책 일지 불러오기
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/api/walk-diaries/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        if (response.data.success) {
          const data = response.data.data;
          setFormData({
            date: data.date,
            walkDiaryWeather: data.walkDiaryWeather,
            walkDiaryEmotion: data.walkDiaryEmotion,
            beginTime: data.beginTime,
            endTime: data.endTime,
            content: data.content,
          });
          // 기존 이미지 URL을 type:url 객체로 변환
          const existingImages = (data.images || []).map((url) => ({
            type: "url",
            data: url,
          }));
          setImages(existingImages);
        } else {
          alert("일지를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("기존 산책 일지 불러오기 실패:", error);
        alert("서버 오류로 일지를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiary();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, val]) => formDataToSend.append(key, val));
      images.forEach((file) => formDataToSend.append("images", file));

      await api.put(`/api/walk-diaries/${id}`, formDataToSend, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      });

      alert("산책 일지가 수정되었습니다!");
      navigate(`/walk-diaries/${id}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("산책 일지 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="row justify-content-center">
      {/* 산책 정보 */}
      <WalkDiaryInfo values={formData} onChange={handleChange} />

      {/* 산책 내용 */}
      <WalkeDiaryContent values={formData} onChange={handleChange} />

      {/* 이미지 업로드 */}
      <ImageBox images={images} onImageChange={setImages} />

      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="outline-secondary" onClick={() => navigate("/walk-diaries")}>
          목록
        </Button>
        <Button variant="outline-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "수정 중..." : "수정 완료"}
        </Button>
      </div>
    </div>
  );
};

export default WalkDiaryUpdatePage;
