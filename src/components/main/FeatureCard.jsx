import React from "react";
import { Card } from "react-bootstrap";
import { FaPaw } from "react-icons/fa";
import "../../styles/MainPage.css";

const FeatureCard = ({ Icon, title, description }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "250px",
        margin: "0 auto",
      }}
    >
      {/* 카드 위 아이콘 */}
      <div
        style={{
          position: "absolute",
          top: "-80px", // 카드 위로 25px 돌출
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FEB916", // 아이콘 배경 필요하면
          borderRadius: "50%",
          padding: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon size={50} className="text-dark" />
      </div>

      <Card
        className="text-center shadow-sm border-0 h-100"
        style={{
          backgroundColor: "rgba(254, 185, 22, 0.7)",
          borderRadius: "10px",
        }}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center p-3 p-md-4">
          {/* 발바닥 아이콘은 카드 중간 */}
          <FaPaw size={50} className="text-dark my-2" />

          {/* 카드 제목 */}
          <Card.Text
            className="mt-2 main-card-title"
          >
            {title}
          </Card.Text>

          {/* 카드 설명 */}
          <Card.Text className="text-dark mt-1 main-card-description">{description}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FeatureCard;
