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
  const handleImageChange = (imgList) => setImages(imgList);
  const handleSubmit = async () => {
    if (!title.trim() || !address.trim() || !content.trim()) {
      alert("제목, 주소, 내용은 반드시 입력해야 합니다.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();

    // JSON 문자열 형태로 묶어서 보냄
    const postData = {
      title,
      address,
      content,
      tableTypeId: 5,
    };
    formData.append(
      "post",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );

    // 이미지 파일들 추가
    images.forEach((file) => {
      formData.append("images", file.data); // file.data에 실제 File 객체가 들어있음
    });

    try {
      const res = await axios.post(
        "http://localhost:8080/api/taily-friends",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
    <div className="row justify-content-center">
      {/* 제목 입력 */}
      <TailyFriendsTitle title={title} setTitle={setTitle} />

      {/* 주소 입력 */}
      <TailyFriendsWriteMap address={address} setAddress={setAddress} />

      {/* 내용 입력 */}
      <TailyFriendsContent content={content} setContent={setContent} />

      {/* 사진 첨부 */}
      <TailyFriendsImageBox images={[]} onImageChange={handleImageChange} />
      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="outline-primary" onClick={() => navigate("/taily-friends")}>
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
