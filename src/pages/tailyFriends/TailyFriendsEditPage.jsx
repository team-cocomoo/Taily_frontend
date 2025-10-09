import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import TailyFriendsTitle from "../../components/board/tailyFriends/TailyFriendsTitle";
import TailyFriendsWriteMap from "../../components/board/tailyFriends/TailyFriendsWriteMap";
import TailyFriendsContent from "../../components/board/tailyFriends/TailyFriendsContent";
import TailyFriendsImageBox from "../../components/board/tailyFriends/TailyFriendsImageBox";

const TailyFriendsEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 게시글 ID 가져오기

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // 새로운 이미지 업로드용

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/taily-friends/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const post = response.data.data;
        setTitle(post.title);
        setAddress(post.address);
        setContent(post.content);
        // 기존 이미지는 URL 배열로 내려온다고 가정
        setImages(post.images || []);
      } catch (err) {
        console.error(err);
        alert("게시글 불러오기 실패");
      }
    };
    fetchPost();
  }, [id]);

  // 수정 완료
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:8080/api/taily-friends/${id}`,
        { title, address, content },
        {
          headers: { Authorization: `Bearer ${token}` },
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
    <div className="row justify-content-center" style={{ marginTop: "250px" }}>
      <TailyFriendsTitle title={title} setTitle={setTitle} />
      <TailyFriendsWriteMap address={address} setAddress={setAddress} />
      <TailyFriendsContent content={content} setContent={setContent} />
      <TailyFriendsImageBox images={images} setImages={setImages} />

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
