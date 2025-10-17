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
    <Card className="mb-4 diary-box">
      <Card.Header>사진</Card.Header>
      <Card.Body className="d-flex flex-wrap justify-content-start gap-3">
        {images.map((img, index) => {
          // ✅ 문자열이면 그대로, 객체면 filePath 사용
          const src = typeof img === "string" ? img : img.filePath;

          return (
            <SecureImage
              key={index}
              src={src}
              alt={`사진 ${index + 1}`}
              style={{
                width: "250px",
                height: "250px",
                objectFit: "cover",
              }}
            />
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default WalkPathImageBox;
