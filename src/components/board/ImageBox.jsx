import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import TailyFriendsTitle from "../../components/board/tailyFriends/TailyFriendsTitle";
import TailyFriendsWriteMap from "../../components/board/tailyFriends/TailyFriendsWriteMap";
import TailyFriendsContent from "../../components/board/tailyFriends/TailyFriendsContent";
import ImageBox from "../../components/board/ImageBox";

const TailyFriendsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/taily-friends/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const post = res.data.data;
        setTitle(post.title);
        setAddress(post.address);
        setContent(post.content);

        // ✅ 서버에서 받은 기존 이미지 → url 타입으로 변환
        if (post.images && post.images.length > 0) {
          const converted = post.images.map((img) => ({
            id: img.id,
            type: "url",
            data: `http://localhost:8080${img.filePath}`,
          }));
          setImages(converted);
        }
      } catch (err) {
        console.error(err);
        alert("게시글 불러오기 실패");
      }
    };
    fetchPost();
  }, [id]);

  // ✅ ImageBox에서 변경된 이미지 정보 받기
  const handleImageChange = (updatedImages) => {
    setImages(updatedImages);
  };

  // ✅ 수정 요청
  const handleUpdate = async () => {
    if (!title.trim() || !address.trim() || !content.trim()) {
      alert("제목, 주소, 내용은 반드시 입력해야 합니다.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();

    const postData = { title, address, content };
    formData.append(
      "post",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );

    // ✅ 새 파일만 업로드 대상 (type === "file")
    images
      .filter((img) => img.type === "file")
      .forEach((img) => formData.append("images", img.data));

    try {
      await axios.patch(
        `http://localhost:8080/api/taily-friends/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("게시글 수정 완료!");
      navigate(`/taily-friends/${id}`);
    } catch (err) {
      console.error(err);
      alert("게시글 수정 실패");
    }
  };

  return (
    <div className="row justify-content-center">
      <TailyFriendsTitle title={title} setTitle={setTitle} />
      <TailyFriendsWriteMap address={address} setAddress={setAddress} />
      <TailyFriendsContent content={content} setContent={setContent} />

      <ImageBox images={images} onImageChange={handleImageChange} />

      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="secondary" onClick={() => navigate("/taily-friends")}>
          목록
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          수정 완료
        </Button>
      </div>
    </div>
  );
};

export default TailyFriendsEditPage;
