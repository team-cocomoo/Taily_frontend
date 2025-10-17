import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import filledHeart from "../../assets/image/filled-heart.png";
import emptyHeart from "../../assets/image/empty-heart.png";

const LikeButton = ({ postId, tableTypeId }) => {
  const { user } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // 게시판 타입별로 경로 결정
  const getBaseUrl = () => {
    switch (tableTypeId) {
      case 3:
        return "api/feeds"; //피드 게시판
      case 5:
        return "api/taily-friends"; // 테일리프렌즈
      case 6:
        return "api/walk-paths"; // 산책 경로 게시판
      default:
        return "api/posts"; // 기본 경로
    }
  };

  // 초기 좋아요 상태와 개수 로딩
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = getBaseUrl();

        const res = await axios.get(
          `http://localhost:8080/${baseUrl}/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLikeCount(res.data.data.likeCount);
        setLiked(res.data.data.liked);
      } catch (err) {
        console.error("좋아요 초기값 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikeStatus();
  }, [postId, tableTypeId]);

  // 좋아요 클릭
  const handleLike = async () => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:8080/api/likes/${tableTypeId}/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { liked: newLiked, likeCount: newLikeCount } = res.data.data;
      setLiked(newLiked);
      setLikeCount(newLikeCount);
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 처리 실패");
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div
      className="like-area d-flex align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handleLike}
    >
      좋아요 {likeCount}{" "}
      <img
        src={liked ? filledHeart : emptyHeart}
        alt="좋아요 하트"
        className="heart"
      />
    </div>
  );
};

export default LikeButton;
