import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TailyFriendsTitle from "../../components/board/tailyFriends/TailyFriendsTitle";
import TailyFriendsWriteMap from "../../components/board/tailyFriends/TailyFriendsWriteMap";
import TailyFriendsContent from "../../components/board/tailyFriends/TailyFriendsContent";
import TailyFriendsImageBox from "../../components/board/tailyFriends/TailyFriendsImageBox";

const TailyFriendsWritePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // 이미지 파일 리스트

  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); // 로그인 시 저장된 토큰
    console.log("토큰: " + token);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("address", address);
    formData.append("content", content);
    images.forEach((file, idx) => formData.append(`images[${idx}]`, file));

    try {
      axios.post(
        "http://localhost:8080/api/taily-friends",
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
      navigate("/taily-friends");
    } catch (err) {
      console.error(err);
      alert("작성 실패");
    }
  };

  return (
    <div className="row justify-content-center" style={{ marginTop: "250px" }}>
      {/* 제목 입력 */}
      <TailyFriendsTitle title={title} setTitle={setTitle} />

      {/* 주소 입력 */}
      <TailyFriendsWriteMap address={address} setAddress={setAddress} />

      {/* 내용 입력 */}
      <TailyFriendsContent content={content} setContent={setContent} />

      {/* 사진 첨부 */}
      <TailyFriendsImageBox images={images} setImages={setImages} />

      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="secondary" onClick={() => navigate("/taily-friends")}>
          목록
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          완료
        </Button>
      </div>
    </div>
  );
};

export default TailyFriendsWritePage;
