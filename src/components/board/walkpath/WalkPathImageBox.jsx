import React from "react";
import { Card } from "react-bootstrap";
import SecureImage from "@/components/common/SecureImage";

const WalkPathImageBox = ({ images = [] }) => {
  if (!images || images.length === 0) {
    return (
      <Card className="mb-4 diary-box">
        <Card.Body>
          <p className="text-muted">등록된 사진이 없습니다.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {images.map((img, index) => {
        // 문자열이면 그대로, 객체면 filePath 사용
        const src = typeof img === "string" ? img : img.filePath;
        return (
          <SecureImage
            key={index}
            src={src}
            alt={`사진 ${index + 1}`}
            style={{
              width: "40%", // 너비 비율 (반응형)
              maxWidth: "800px", // 최대 너비 제한
              height: "auto", // 비율 유지
              borderRadius: "20px", // 둥근 모서리
              display: "block",
              margin: "0 auto", 
              objectFit: "cover", // 잘리는 방식
            }}
          />
        );
      })}
    </div>
  );
};

export default WalkPathImageBox;
