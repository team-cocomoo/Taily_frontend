// pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// ErrorAlert 컴포넌트를 활용한 버전 (선택사항)
import ErrorAlert from "../components/common/ErrorAlert";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-5">
      {/* 404 에러 아이콘 */}
      <div className="mb-4" style={{ fontSize: "5rem" }}>
        🔍
      </div>
      {/* ErrorAlert 컴포넌트 활용 */}
      <div className="d-inline-block">
        <h1 className="mb-3">404 Error</h1>
        {/* props 를 이용해 공통 컴포넌트를 사용한다 */}
        <ErrorAlert 
        message="요청하신 페이지가 존재하지 않습니다." 
        variant = "warning"
        onGoBack={() => navigate(-1)} // 이전 페이지로
        />
        {/* 또는 홈으로 가는 추가 버튼 */}
        <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
