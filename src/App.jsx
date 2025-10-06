// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import AuthProvider from "./contexts/AuthProvider";
import HeaderNavbar from "./components/common/HeaderNavbar";
import Footer from "./components/common/Footer";

// 페이지 컴포넌트
import WalkDiaryWritePage from "./pages/walkDiary/WalkDiaryWritePage";
import TailyFriendsDetailPage from "./pages/tailyFriends/TailyFriendsDetailPage";
import LoginPage from "./pages/user/LoginPage";
import WalkPathMainPage from "./pages/walkPath/WalkPathMainPage";
import WalkPathDetailPage from "./pages/walkPath/WalkPathDetailPage";
import WalkPathWritePage from "./pages/walkPath/WalkPathWritePage";
import WalkDiaryCalendarPage from "./pages/walkDiary/WalkDiaryCalendarPage";
import WalkDiaryWritePage from "./pages/walkdiary/WalkDiaryWritePage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <HeaderNavbar />

          <Container className="mt-4">
            <Routes>
              {/* 로그인 페이지 */}
              <Route path="/" element={<LoginPage />} />

              <Route path="/" element={<LoginPage />} />
              {/* 로그인 페이지 */}

              <Route path="/login" element={<LoginPage />} />

              {/* 산책 경로 관련 */}
              <Route path="/walk-paths" element={<WalkPathMainPage />} />

              <Route path="/walk-paths/:id" element={<WalkPathDetailPage />} />
              <Route path="/walk-paths/write" element={<WalkPathWritePage />} />

              {/* 친구 상세 */}
              {/* 산책 경로 상세 페이지 */}
              <Route path="/walkpath/:id" element={<WalkPathDetailPage />} />

              <Route path="/diary" element={<WalkDiaryCalendarPage />} />
              {/* <Route path="/login" element={<LoginPage />} /> */}
              {/* 테일리프렌즈 페이지 */}
              <Route path="/taily-friends" element={<TailyFriendsMainPage />} />
              {/* 테일리프렌즈 상세 페이지 */}
              <Route
                path="/taily-friends/:id"
                element={<TailyFriendsDetailPage />}
              />


              {/* 산책 일지 작성 */}
              <Route
                path="/walk-diary/write"
                element={<WalkDiaryWritePage />}
              />


            </Routes>
          </Container>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
