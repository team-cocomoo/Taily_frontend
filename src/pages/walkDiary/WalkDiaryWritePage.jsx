import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WalkDiaryInfo from "../../components/board/walkdiary/WalkDiaryInfo";
import WalkeDiaryContent from "../../components/board/walkdiary/WalkeDiaryContent";
import ImageBox from "../../components/board/ImageBox";
import "../../styles/walkdiary/WalkDiaryWrite.css";
import api from "../../config/apiConfig";

const WalkDiaryWritePage = () => {
  const navigate = useNavigate();
  const { date } = useParams();

  const [formData, setFormData] = useState({
    walkDiaryWeather: "SUNNY",
    walkDiaryEmotion: "LOVE",
    content: "",
    beginTime: "",
    endTime: "",
  });

  const [images, setImages] = useState([]); // 이미지 리스트 { type: "file", data: File } 구조
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) setFormData((prev) => ({ ...prev, date }));
  }, [date]);

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
    if (error) setError("");
  };

  /** ✅ 1️⃣ 이미지 업로드 함수 */
  const uploadImages = async (token) => {
    if (!images || images.length === 0) return [];

    const uploadForm = new FormData();
    uploadForm.append("tableTypesId", 4); // WALK_DIARY
    uploadForm.append("subFolder", "walk_diary");

    images.forEach((img) => {
      if (img.type === "file" && img.data instanceof File) {
        uploadForm.append("files", img.data);
      }
    });

    const res = await api.post("/api/images/upload", uploadForm, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    // 서버에서 받은 이미지 id 리스트 반환
    return res.data.map((img) => img.id);
  };

  console.log("🖼️ images 상태:", images);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("accessToken");

    try {
      // (1) 이미지 먼저 업로드 → ID 리스트 받기
      const imageIds = await uploadImages(token);

      // ✅ 1. walkDiary JSON 객체 만들기
      // (2) walkDiary JSON 객체 만들기
      const diaryData = {
        walkDiaryWeather: formData.walkDiaryWeather,
        beginTime: formData.beginTime,
        endTime: formData.endTime,
        walkDiaryEmotion: formData.walkDiaryEmotion,
        content: formData.content,
        imageIds, // ✅ 이미지 ID 배열
      };

      // (3) JSON Blob 생성
      const formDataToSend = new FormData();
      formDataToSend.append(
        "walkDiary",
        new Blob([JSON.stringify(diaryData)], { type: "application/json" })
      );

      // (4) 산책일지 작성 요청
      const response = await api.post(
        `/api/walk-diaries/write/${date}`,
        formDataToSend,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("산책 일지가 작성되었습니다!");
        navigate("/walk-diaries");
      } else {
        setError(response.data.message || "작성 실패");
      }
    } catch (error) {
      console.error("🚨 작성 중 오류: ", error);
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
        <Button
          variant="outline-primary"
          onClick={() => navigate("/walk-diaries")}
        >
          목록
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "작성 중..." : "작성완료"}
        </Button>
      </div>
    </div>
  );
};

export default WalkDiaryWritePage;
