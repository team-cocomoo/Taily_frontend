// components/common/ErrorAlert.jsx
import React from 'react';
import { Alert, Button } from 'react-bootstrap';

/**
 * 에러 알림 컴포넌트
 * @param {string} message - 에러 메시지
 * @param {string} variant - Alert 색상 ('danger', 'warning')
 * @param {function} onRetry - 재시도 함수
 * @param {function} onGoBack - 뒤로가기 함수
 */
const ErrorAlert = ({ 
  message, 
  variant = 'danger', 
  onRetry, 
  onGoBack 
}) => {
  return (
    <Alert variant={variant} className="mt-3">
      {/* 에러 메시지 */}
      <p>{message}</p>
      
      {/* 액션 버튼들 */}
      <div className="mt-3 d-flex gap-2">
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            다시 시도
          </Button>
        )}
        {onGoBack && (
          <Button variant="secondary" onClick={onGoBack}>
            돌아가기
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default ErrorAlert;