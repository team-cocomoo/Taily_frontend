// components/common/LoadingSpinner.jsx
import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * 로딩 스피너 컴포넌트
 * @param {string} size - 스피너 크기 ('sm', 'md', 'lg')
 * @param {string} message - 로딩 메시지
 */
const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  // 크기별 스타일 맵핑
  const sizeStyles = {
    sm: { width: '1.5rem', height: '1.5rem' },
    md: { width: '3rem', height: '3rem' },
    lg: { width: '4rem', height: '4rem' }
  };

  return (
    <div className="text-center mt-5">
      <Spinner 
        animation="border" 
        role="status"
        style={sizeStyles[size]}
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {/* 메시지가 있으면 표시 */}
      {message && (
        <p className="mt-3 text-muted">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;