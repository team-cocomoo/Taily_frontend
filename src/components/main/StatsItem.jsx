// src/components/StatsItem.jsx

import React from 'react';
import { FaDog, FaStar, FaCut, FaAppleAlt } from 'react-icons/fa';
// 예시 아이콘: FaDog(산책러), FaStar(입점), FaCut(양육수), FaAppleAlt(공유)

/**
 * 통계 항목 컴포넌트
 * @param {object} props
 * @param {React.ComponentType} props.Icon - 통계 아이콘
 * @param {string} props.value - 통계 값 (예: "6000+")
 * @param {string} props.label - 통계 설명 (예: "산책러 수")
 */
const StatsItem = ({ Icon, value, label }) => {
  return (
    <div className="text-center p-3">
      {/* 아이콘 */}
      <Icon size={30} className="text-primary mb-2" />
      
      {/* 통계 값 */}
      <h4 className="fw-bold mb-1 text-dark">{value}</h4>
      
      {/* 통계 설명 */}
      <p className="text-muted mb-0">{label}</p>
    </div>
  );
};

export default StatsItem;