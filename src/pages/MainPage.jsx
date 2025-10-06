// src/pages/MainContent.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FeatureCard from '../components/main/FeatureCard';
import StatsItem from '../components/main/StatsItem';
// react-icons에서 필요한 아이콘들을 가져옵니다.
import { 
  FaInstagram, FaCalendarAlt, FaHome, FaMapMarkerAlt, 
  FaDog, FaStar, FaCut, FaAppleAlt 
} from 'react-icons/fa';

const MainPage = () => {
  // 기능 카드 데이터
  const featureData = [
    { Icon: FaInstagram, title: '펫 스토리 소개' },
    { Icon: FaCalendarAlt, title: '산책 장소 소개' },
    { Icon: FaHome, title: '우리 동네 핫플 소개' },
    { Icon: FaMapMarkerAlt, title: '산책 경로' },
  ];

  // 통계 데이터
  const statsData = [
    { Icon: FaDog, value: '6000+', label: '산책러 수' },
    { Icon: FaStar, value: '10+', label: '입점 장소' },
    { Icon: FaCut, value: '300+', label: '반려동물 양육수' },
    { Icon: FaAppleAlt, value: '64', label: '산책 공유 수' },
  ];

  return (
    <div>
      {/* 1. 메인 배너 섹션 */}
      <section className="position-relative" style={{ height: '1080px', minHeight: '1080px' }}>
        {/* 배경 이미지 */}
        <div 
          className="bg-image w-100 h-100" 
          style={{ 
            backgroundImage: `url('./메인 페이지.jpg')`, // 이미지 경로는 프로젝트에 맞게 수정 필요
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
          }}
        >
          {/* 이미지 위에 텍스트나 다른 요소가 있다면 여기에 배치 */}
        </div>

        {/* 기능 카드 섹션 (이미지 하단에 겹쳐지도록 배치) */}
        <Container className="position-absolute start-50 translate-middle-x" style={{ top: 'calc(70vh - 80px)' }}>
          <Row xs={2} md={4} className="g-3 justify-content-center">
            {featureData.map((feature, index) => (
              <Col key={index} className="d-flex">
                <FeatureCard Icon={feature.Icon} title={feature.title} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 2. 오늘의 테일리 정보 섹션 */}
      <section className="py-5" style={{ marginTop: '100px' }}> {/* 카드 높이만큼 여백 확보 */}
        <Container>
          <h3 className="text-center fw-bold mb-5 text-secondary">오늘의 테일리 정보</h3>
          <Row xs={2} md={4} className="g-4">
            {statsData.map((stat, index) => (
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