import React, { useEffect, useState } from "react";
import api from "@/config/apiConfig"; // axios 인스턴스

/**
 * JWT 포함 이미지 로딩 컴포넌트
 * @param {string} src - 서버 이미지 경로 (/uploads/feed/xxxx.jpg)
 * @param {string} alt - 이미지 대체 텍스트
 * @param {object} style - 추가 스타일
 */
export default function SecureImage({ src, alt, style }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        setLoading(true);
        const res = await api.get(src, {
          responseType: "blob", // 바이너리 형태로 받기
        });

        if (!isMounted) return;

        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("이미지 로딩 실패:", err);
        if (isMounted) setError(true);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (imageUrl) URL.revokeObjectURL(imageUrl); // 메모리 해제
    };
  }, [src]);

  if (loading) return <p>로딩중...</p>;
  if (error) return <p>이미지 로딩 실패</p>;

  return (
    <img src={imageUrl} alt={alt} style={style} className="rounded mb-1" />
  );
}
