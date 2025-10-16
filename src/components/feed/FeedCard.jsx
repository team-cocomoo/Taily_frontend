import React, { useState } from "react";
import { toggleLike } from "@/api/FeedService";
import SecureImage from "./SecureImage"; // SecureImage import

export default function FeedCard({ feed, onLikeToggle }) {
  const [liked, setLiked] = useState(feed.liked || false);
  const [likeCount, setLikeCount] = useState(feed.likeCount || 0);

  const handleLike = async () => {
    try {
      await toggleLike(feed.id);
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => prev + (newLiked ? 1 : -1));
      onLikeToggle(feed.id, newLiked);
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
    }
  };

  return (
    <div className="feed-card border p-3 mb-3 rounded shadow-sm">
      <p>{feed.content}</p>
      <div className="feed-images my-2">
        {feed.images?.map((img, i) => (
          <SecureImage
            key={i}
            src={img}
            alt={`feed-${i}`}
            style={{ maxWidth: "100%" }}
          />
        ))}
      </div>
      <button
        className={`btn btn-sm ${
          liked ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={handleLike}
      >
        {liked ? "♥ 좋아요" : "♡ 좋아요"} {likeCount}
      </button>
    </div>
  );
}
