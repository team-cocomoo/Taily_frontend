import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FeatureCard from "../components/main/FeatureCard";
import StatsItem from "../components/main/StatsItem";
import MainVideo from "../assets/video/main-video.mp4";
import "../styles/MainPage.css";
import {
  FaInstagram,
  FaCalendarAlt,
  FaHome,
  FaMapMarkerAlt,
  FaDog,
  FaStar,
  FaCut,
  FaAppleAlt,
} from "react-icons/fa";

const MainPage = () => {
  const sectionRefs = useRef([]);

  const featureData = [
    { Icon: FaInstagram, title: "펫스토리", description: "피드에서는 반려동물 사진을 올리고 공유할 수 있으며, 대화방에서는 원하는 사람과 자유롭게 대화를 나눌 수 있습니다." },
    { Icon: FaMapMarkerAlt, title: "산책 공간", description: "산책일지로 산책 기록과 사진을 남기고, 테일리프렌즈에서 함께할 사람을 찾거나 산책 경로를 공유할 수 있습니다." },
    { Icon: FaHome, title: "우리동네정보", description: "GPS를 기반으로 내 주변 동물병원을 확인하고, 전국 단위 검색으로 필요한 동물병원을 쉽게 찾을 수 있습니다." },
    { Icon: FaCalendarAlt, title: "이벤트", description: "SNS 태그를 이용해 다양한 이벤트에 참여하고, 쉽고 재미있게 참여 경험을 즐길 수 있습니다." },
  ];

  const statsData = [
    { Icon: FaDog, value: "6000+", label: "산책러 수" },
    { Icon: FaStar, value: "10+", label: "입점 장소" },
    { Icon: FaCut, value: "300+", label: "반려동물 양육수" },
    { Icon: FaAppleAlt, value: "64", label: "산책 공유 수" },
  ];

  return (
    <div className="main-page-container">
      {/* 비디오 */}
      <section className="section video-section" ref={el => (sectionRefs.current[0] = el)}>
        <video
          src={MainVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="main-video"
        />
        <div className="video-text-container">
          <p className="text-white video-text">반려동물,나 그리고 우리</p>
          <p className="text-white video-text">하나가 되는 이 곳, Taily</p>
        </div>
      </section>

      {/* 기능 카드 */}
      <section className="section feature-section" ref={el => (sectionRefs.current[1] = el)}>
        <Container>
          <Row xs={1} sm={2} md={4} className="g-4 justify-content-center">
            {featureData.map((feature, index) => (
              <Col key={index} className="d-flex justify-content-center" style={{ marginTop: "80px" }}>
                <FeatureCard Icon={feature.Icon} title={feature.title} description={feature.description} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 오늘의 테일리 정보 */}
      <section className="section today-taily-section" ref={el => (sectionRefs.current[2] = el)}>
        <Container>
          <h3 className="text-center fw-bold mb-5 text-secondary">오늘의 테일리 정보</h3>
          <Row xs={1} md={2} className="g-4 justify-content-center">
            {statsData.slice(0, 2).map((stat, index) => (
              <Col key={index}>
                <StatsItem Icon={stat.Icon} value={stat.value} label={stat.label} />
              </Col>
            ))}
          </Row>
          <Row xs={1} md={2} className="g-4 justify-content-center mt-3">
            {statsData.slice(2, 4).map((stat, index) => (
              <Col key={index}>
                <StatsItem Icon={stat.Icon} value={stat.value} label={stat.label} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default MainPage;
