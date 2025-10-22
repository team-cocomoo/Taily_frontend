import React, { useState } from "react";
import { createFeed } from "@/api/feedService";

const SingleFeedUploader = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState("");

  const handleContentChange = (e) => setContent(e.target.value);
  const handleImageChange = (e) => setImages(Array.from(e.target.files));
  const handleTagsChange = (e) => setTags(e.target.value);

  const handleUpload = async () => {
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();

      // 입력한 태그를 , 기준으로 배열로 변환
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const feedData = {
        content: content,
        tableTypeId: 3,
        tags: tagArray,
      };

      // feed JSON을 Blob으로 변환
      formData.append(
        "feed",
        new Blob([JSON.stringify(feedData)], { type: "application/json" })
      );

      // 이미지 추가
      images.forEach((file) => formData.append("images", file));

      const res = await createFeed(formData);
      console.log("업로드 완료:", res.data);
      alert("피드 업로드 완료!");

      // 초기화
      setContent("");
      setImages([]);
      setTags("");
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  return (
    <div>
      <h2>피드 업로드 (1개 + 이미지 + 태그)</h2>
      <textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={handleContentChange}
        rows={3}
        cols={50}
      />
      <br />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <br />
      <input
        type="text"
        placeholder="태그를 ,로 구분하여 입력하세요"
        value={tags}
        onChange={handleTagsChange}
        style={{ width: "300px", marginTop: "5px" }}
      />
      <br />
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        업로드
      </button>
    </div>
  );
};

export default SingleFeedUploader;
