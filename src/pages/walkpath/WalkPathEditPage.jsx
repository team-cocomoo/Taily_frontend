import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import WalkPathImageBoxEdit from "../../components/board/walkpath/WalkPathImageBoxEdit";
import WalkPathTitle from "../../components/board/walkpath/WalkPathTitle";
import WalkPathMapInput from "../../components/board/walkpath/WalkPathMapInput";
import WalkPathContent from "../../components/board/walkpath/WalkPathContent";

const WalkPathEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 게시글 ID 가져오기

  const [title, setTitle] = useState("");
  const [routes, setRoutes] = useState([]); // ✅ 빈 배열로 변경
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // 새로운 이미지 업로드용

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/walk-paths/${id}`,
          {
            headers: { Authorization: `Bearer ${token}`,"Content-Type": "multipart/form-data" },
          }
        );
        const post = response.data.data;
        setTitle(post.title);
        setContent(post.content);
        setRoutes(post.routes?.map((r) => r.address) || []); // ✅ 안정적 처리
        setImages(post.images || []);
      } catch (err) {
        console.error(err);
        alert("게시글 불러오기 실패");
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || routes.length === 0 || !content.trim()) {
      alert("제목, 주소, 내용은 반드시 입력해야 합니다.");
      return;
    }

    const token = localStorage.getItem("token");
    // ✅ FormData 객체 생성
    const formData = new FormData();

    // Json Data(requestDto) 추가
    const requestDto = {
      title,
      content,
      routes: routes.map((addr, idx) => ({
        address: addr,
        orderNo: idx + 1,
      })),
    };

    // Blob으로 감싸서 JSON 형태로 추가
    formData.append(
      "requestDto",
      new Blob([JSON.stringify(requestDto)], { type: "application/json" })
    );

    // ✅ 2) 새 이미지 파일 추가
    // 만약 사용자가 새로운 이미지를 선택했다면
    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("newImages", file);
      }
    });

    try {
      await axios.patch(
        `http://localhost:8080/api/walk-paths/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("게시글 수정 완료!");
      navigate(`/walk-paths/${id}`);
    } catch (err) {
      console.error(err);
      alert("게시글 수정 실패");
    }
  };

  return (
    <div className="row justify-content-center">
      <WalkPathTitle title={title} onChange={setTitle} />
      <WalkPathMapInput mode="edit" routes={routes} onChange={setRoutes} />
      <WalkPathContent content={content} onChange={setContent} />
      <WalkPathImageBoxEdit images={images} setImages={setImages} />

      <div className="d-flex justify-content-center gap-2 mt-3">
        <Button variant="secondary" onClick={() => navigate("/walk-paths")}>
          목록
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          수정 완료
        </Button>
      </div>
    </div>
  );
};

export default WalkPathEditPage;
