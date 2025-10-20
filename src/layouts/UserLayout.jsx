import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderNavbar from "@/components/common/HeaderNavbar";
import Footer from "@/components/common/Footer";
import "@/styles/layout/UserLayout.css";

/**
 * UserLayout
 * - 모든 사용자 페이지 공통 레이아웃
 * - 헤더, 푸터 유지 + 페이지 컨텐츠는 Outlet으로 표시
 */
const UserLayout = () => {
  const location = useLocation();

  // 메인 페이지는 여백 제거
  const isMainPage = location.pathname === "/";

  return (
    <div className="user-layout">
      {/* 상단 헤더 */}
      <HeaderNavbar />

      {/* 페이지 본문 */}
      <main
        className={`container ${
          isMainPage ? "no-margin-top" : "user-container"
        }`}
      >
        <Outlet /> {/* 자식 라우트 렌더링 */}
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default UserLayout;
