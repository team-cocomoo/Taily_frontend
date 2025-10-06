// src/components/FeatureCard.jsx

import React from 'react';
import { Card } from 'react-bootstrap';
// 예시: react-icons 라이브러리 사용 가정 (추가 설치 필요)
import { FaPaw, FaInstagram, FaCalendarAlt, FaHome, FaMapMarkerAlt } from 'react-icons/fa';

/**
 * 기능 카드 컴포넌트
 * @param {object} props
 * @param {React.ComponentType} props.Icon - 기능 아이콘 (예: FaInstagram)
 * @param {string} props.title - 기능 제목
 */
const FeatureCard = ({ Icon, title }) => {
  return (
    <Card 
      className="text-center shadow-sm border-0 h-100" 
      style={{ backgroundColor: '#FEB916', borderRadius: '10px' }}
    >
      <Card.Body className="d-flex flex-column justify-content-center align-items-center p-3 p-md-4">
        {/* 상단 기능 아이콘 */}
        <Icon size={40} className="mb-2 text-dark" />
        
        {/* 발바닥 아이콘 (이미지에 있는 디자인 요소) */}
        <FaPaw size={50} className="text-dark my-2" /> 

        <Card.Text className="mt-2 fw-bold text-dark fs-6">
          {title}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FeatureCard;