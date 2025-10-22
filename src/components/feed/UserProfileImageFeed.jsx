import React, { useEffect, useState } from "react";
import api from "@/config/apiConfig";
import SecureImage from "@/components/common/SecureImage"; // 기존 JWT 이미지 로더 활용
import defaultUserIcon from "@/assets/image/user-icon.png"; // 기본 이미지 import

/**
 * 로그인된 사용자의 프로필 이미지를 자동으로 불러와 표시하는 컴포넌트
 * - tableTypesId=1 → USERS 기준
 * - 내부적으로 SecureImage를 사용해 JWT 포함 요청 처리
 *
 * @param {number} size - 이미지 크기(px), 기본 120
 * @param {string} alt - 대체 텍스트
 * @param {object} style - 추가 커스텀 스타일
 */
export default function UserProfileImageFeed({
  size = 120,
  alt = "프로필 이미지",
  style,
}) {
  const [imagePath, setImagePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileImage = async () => {
      try {
        setLoading(true);
        // 프로필 이미지 조회 (최신 1개)
        const res = await api.get("/api/images", {
          params: { tableTypesId: 1 },
        });

        if (!isMounted) return;

        if (res.data && res.data.length > 0) {
          setImagePath(res.data[0].filePath); // ex: "/uploads/users/uuid_filename.jpg"
        } else {
          setImagePath(null);
        }
      } catch (err) {
        console.error("프로필 이미지 불러오기 실패:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();

    return () => {
      isMounted = false;
    };
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div
        className="rounded-circle bg-light d-flex justify-content-center align-items-center"
        style={{
          width: size,
          height: size,
          border: "1px solid #ddd",
          fontSize: "0.9rem",
          color: "#999",
        }}
      >
        로딩중...
      </div>
    );
  }

  // 에러 또는 이미지 없음
  if (error || !imagePath) {
    return (
      <div
        className="rounded-circle bg-light d-flex justify-content-center align-items-center"
        style={{
          width: size,
          height: size,
          border: "1px solid #ddd",
          overflow: "hidden", // ✅ 이미지가 원형 안에 꽉 차게
          ...style,
        }}
      >
        <img
          src={defaultUserIcon}
          alt="기본 프로필 이미지"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  // 정상 이미지 표시 (SecureImage 활용)
  return (
    <SecureImage
      src={imagePath}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid #ddd",
        ...style,
      }}
    />
  );
}
