import React, { useState } from "react";
import { createFeed } from "@/api/feedService";

const FeedUploader = () => {
  const [feeds, setFeeds] = useState([{ content: "", images: [] }]);

  // 새 피드 추가 (최대 5개)
  const addFeed = () => {
    if (feeds.length >= 5) return;
    setFeeds([...feeds, { content: "", images: [] }]);
  };

  // 피드 제거
  const removeFeed = (index) => {
    setFeeds(feeds.filter((_, i) => i !== index));
  };

  const handleContentChange = (index, value) => {
    const newFeeds = [...feeds];
    newFeeds[index].content = value;
    setFeeds(newFeeds);
  };

  const handleImageChange = (index, files) => {
    const newFeeds = [...feeds];
    newFeeds[index].images = Array.from(files);
    setFeeds(newFeeds);
  };

  const handleUpload = async () => {
    try {
      for (let i = 0; i < feeds.length; i++) {
        const formData = new FormData();

        const feedData = {
          content: feeds[i].content,
          tableTypeId: 3,
          tags: ["example"],
        };

        formData.append(
          "feed",
          new Blob([JSON.stringify(feedData)], { type: "application/json" })
        );

        feeds[i].images.forEach((file) => {
          formData.append("images", file);
        });

        const res = await createFeed(formData);
        console.log(`글 ${i + 1} 업로드 완료:`, res.data);
      }

      alert(`${feeds.length}개 글 업로드 완료!`);
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  return (
    <div>
      <h2>피드 업로드</h2>
      {feeds.map((feed, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <textarea
            placeholder={`글 ${idx + 1} 내용`}
            value={feed.content}
            onChange={(e) => handleContentChange(idx, e.target.value)}
            rows={3}
            cols={50}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(idx, e.target.files)}
          />
          {feeds.length > 1 && (
            <button
              onClick={() => removeFeed(idx)}
              style={{ marginLeft: "10px" }}
            >
              삭제
            </button>
          )}
        </div>
      ))}
      {feeds.length < 5 && (
        <button onClick={addFeed} style={{ marginBottom: "10px" }}>
          새 피드 추가
        </button>
      )}
      <br />
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
};

export default FeedUploader;
