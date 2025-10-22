import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import TailyFriendsTitle from "../../components/board/tailyFriends/TailyFriendsTitle";
import TailyFriendsWriteMap from "../../components/board/tailyFriends/TailyFriendsWriteMap";
import TailyFriendsContent from "../../components/board/tailyFriends/TailyFriendsContent";
import ImageBox from "../../components/board/tailyFriends/TailyFriendsEditImageBox";

const TailyFriendsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);

  /** ✅ 게시글 불러오기 */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/api/taily-friends/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const post = res.data.data;
        setTitle(post.title);
        setAddress(post.address);
        setContent(post.content);
        setExistingImages(post.images || []);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글 불러오기 실패");
      }
    };
    fetchPost();
  }, [id]);

  /** ✅ 이미지 변경 콜백 */
  const handleImageChange = (updatedImages) => {
    setImages(updatedImages);
  };

  /** ✅ 수정 요청 */
  const handleUpdate = async () => {
    if (!title.trim() || !address.trim() || !content.trim()) {
      alert("제목, 주소, 내용은 반드시 입력해야 합니다.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();

    // ✅ JSON 형태 데이터
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

    // ✅ 새로 추가된 이미지 (File 객체)
    images
      .filter((img) => img.type === "file")
      .forEach((img) => formData.append("newImages", img.data));

    // ✅ 기존 유지할 이미지 경로들 → JSON 문자열로 한 번에 전달
    const existingPaths = images
      .filter((img) => img.type === "url")
      .map((img) => img.data);

    formData.append(
      "existingImagePaths",
      new Blob([JSON.stringify(existingPaths)], { type: "application/json" })
    );

    try {
      await axios.patch(`http://localhost:8080/api/taily-friends/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("게시글 수정 완료!");
      navigate(`/taily-friends/${id}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      alert("게시글 수정 실패");
    }
  };

  /** ✅ 렌더링 */
  return (
    <div className="row justify-content-center">
      {/* 제목 */}
      <TailyFriendsTitle title={title} setTitle={setTitle} />

      {/* 주소 */}
      <TailyFriendsWriteMap address={address} setAddress={setAddress} />

      {/* 내용 */}
      <TailyFriendsContent content={content} setContent={setContent} />

      {/* 이미지 */}
      <ImageBox existingImages={existingImages} onImageChange={handleImageChange} />

      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="outline-primary" onClick={() => navigate("/taily-friends")}>
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
