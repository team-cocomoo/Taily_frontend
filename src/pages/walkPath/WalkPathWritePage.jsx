import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageBox from "../../components/board/ImageBox";
import WalkPathContent from "../../components/board/walkPath/WalkPathContent";
import WalkPathTitle from "../../components/board/walkPath/WalkPathTitle";
import WalkPathMapInput from "../../components/board/walkPath/WalkPathMapInput";
import "../../styles/walkPath/WalkPathWrite.css";

const WalkPathWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [routes, setRoutes] = useState([]);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // 이미지 파일 리스트

  const handleSubmit = async () => {
    console.log("현재 routes 상태:", routes);
    if (!title.trim() || !routes.length === 0 || !content.trim()) {
      alert("제목, 주소, 내용은 반드시 입력해야합니다");
      return;
    }
    const token = localStorage.getItem("token"); // 로그인 시 저장된 토큰
    console.log("토큰:" + token);
    const formData = new FormData();

    //JSON 형태로 묶어서 Blob 반환
    const walkPathData = {
      title,
      content,
      routes: routes.map((addr, idx) => ({
        address: addr,
        orderNo: idx + 1,
      })),
    };

    formData.append(
      "walkpath",
      new Blob([JSON.stringify(walkPathData)], { type: "application/json" })
    );

    //이미지 추가
    images.forEach((img) => formData.append("images", img.data));

    // 디버깅용 로그
    for (let [key, value] of formData.entries()) {
      console.log("FormData:", key, value);
    }

    try {
      await axios.post("http://localhost:8080/api/walk-paths", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("작성 완료!");
      navigate("/walk-paths");
    } catch (err) {
      console.error(err);
      alert("작성 실패");
    }
  };

  return (
    <div className="container main-content">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* 제목 */}
          <WalkPathTitle title={title} onChange={setTitle} />

          {/* 산책 경로 - 지도 API */}
          <WalkPathMapInput onChange={setRoutes} />

          {/*  내용 */}
          <WalkPathContent content={content} onChange={setContent} />

          {/* 사진 첨부 */}
          <ImageBox images={images} onImageChange={setImages} />

          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button variant="secondary" onClick={() => navigate("/walk-paths")}>
              목록
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkPathWritePage;
