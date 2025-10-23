import React, { useEffect, useState } from "react";
import api from "@/config/apiConfig";
import SecureImage from "@/components/common/SecureImage";
import defaultUserIcon from "@/assets/image/user-icon.png";

/**
 * UserProfileImageFeed
 * - usersId가 있으면 해당 유저(피드 작성자) 이미지 표시
 * - usersId가 없으면 로그인한 유저의 프로필 이미지 표시
 *
 * @param {number|null} usersId - 작성자 ID (FeedResponseDto.writerId), 없으면 로그인 사용자
 * @param {number} size - 이미지 크기(px), 기본 120
 * @param {string} alt - 대체 텍스트
 * @param {object} style - 추가 커스텀 스타일
 */
export default function UserProfileImageFeed({
  usersId = null,
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

        const params = { tableTypesId: 1 };
        if (usersId) {
          // ✅ 작성자 기준
          params.usersId = usersId;
        }
        // usersId가 없으면 로그인 사용자 기준 (백엔드에서 자동 처리)

        const res = await api.get("/api/images", { params });

        if (!isMounted) return;

        if (res.data && res.data.length > 0) {
          setImagePath(res.data[0].filePath);
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
  }, [usersId]);

  // 로딩 중
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
          overflow: "hidden",
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

  // 정상 이미지 표시
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
