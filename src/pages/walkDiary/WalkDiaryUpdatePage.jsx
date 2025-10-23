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

          // ✅ 기존 이미지: 서버에서 받은 id + filePath 그대로 반영
          const existingImages = (data.images || []).map((img) => ({
            id: img.id,           // DB에서 받은 이미지 id
            type: "url",          // 기존 서버 이미지
            data: img.filePath,   // /uploads/walk_diary/... 형태
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

    // ✅ 새로 추가된 파일만 업로드
    const newFiles = images.filter((img) => img.type === "file").map((img) => img.data);
    let uploadedImageIds = [];

    if (newFiles.length > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append("tableTypesId", 4); // WALK_DIARY
      uploadFormData.append("subFolder", "walk_diary");

      newFiles.forEach((file) => uploadFormData.append("files", file));

      const uploadRes = await api.post(`/api/images/upload`, uploadFormData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      });

      uploadedImageIds = uploadRes.data.map((img) => img.id);
    }

    // ✅ 기존 이미지 ID (삭제되지 않은 것만)
    const existingImageIds = images
      .filter((img) => img.type === "url" && img.id)
      .map((img) => img.id);

    // ✅ 최종 전송할 이미지 ID
    const finalImageIds = [...existingImageIds, ...uploadedImageIds];

    // ✅ walkDiaryPayload
    const walkDiaryPayload = {
      walkDiaryWeather: formData.walkDiaryWeather,
      beginTime: formData.beginTime,
      endTime: formData.endTime,
      walkDiaryEmotion: formData.walkDiaryEmotion,
      content: formData.content,
      imageIds: finalImageIds, // ✅ 기존 + 새 이미지 모두 포함
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
      "walkDiary",
      new Blob([JSON.stringify(walkDiaryPayload)], { type: "application/json" })
    );

    await api.put(`/api/walk-diaries/${id}`, formDataToSend, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    alert("산책 일지가 수정되었습니다!");
    navigate(`/walk-diaries/${id}`);
  } catch (error) {
    console.error("🚨 수정 실패:", error);
    alert("산책 일지 수정 중 오류가 발생했습니다.");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="row justify-content-center">
      {/* 산책 정보 */}
      <WalkDiaryInfo values={formData} onChange={handleChange} readOnlyDate />

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
