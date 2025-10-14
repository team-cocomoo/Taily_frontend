import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageBox from "../../components/board/ImageBox";
import WalkPathContent from "../../components/board/walkPath/WalkPathContent";
import WalkPathTitle from "../../components/board/walkPath/WalkPathTitle";
import WalkPathMap from "../../components/board/walkPath/WalkPathMap";
import "../../styles/walkPath/WalkPathWrite.css";

const WalkPathWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // 이미지 파일 리스트

  const handleSubmit = async() => {
    if(!title.trim() || !address.trim() || !content.trim()){
      alert("제목, 주소, 내용은 반드시 입력해야합니다");
      return;
    }
    const token = localStorage.getItem("token");// 로그인 시 저장된 토큰
    console.log("토큰:"+token);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("address", address);
    formData.append("content", content);
    images.forEach((file, idx) => formData.append(`images[${idx}]`, file));

    try {
      axios.post(
        "http://localhost:8080/api/walk-paths",
        {
          title,
          address,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("작성 완료!");
      navigate("/walk-paths");
    } catch (err) {
      console.error(err);
      alert("작성 실패");
    }
  }

  return (
    <div className="container main-content">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* 제목 */}
          <WalkPathTitle title={title} onChange={setTitle} />

          {/* 산책 경로 - 지도 API */}
          <WalkPathMap address={address} onChange={setAddress}/>

          {/*  내용 */}
          <WalkPathContent content={content} setContent={setContent} />

          {/* 사진 첨부 */}
          <ImageBox images={images} setImages={setImages}/>

          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button variant="secondary" onClick={() => navigate("/")}>
              목록
            </Button>
            <Button variant="primary" onClick={handleSubmit}>완료</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkPathWritePage;
