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
import TailyFriendsMainPage from "./pages/tailyFriends/TailyFriendsMainPage";
import TailyFriendsDetailPage from "./pages/tailyFriends/TailyFriendsDetailPage";
import TailyFriendsWritePage from "./pages/tailyFriends/TailyFriendsWritePage";
import LoginPage from "./pages/user/LoginPage";
import WalkPathMainPage from "./pages/walkPath/WalkPathMainPage";
import WalkPathDetailPage from "./pages/walkPath/WalkPathDetailPage";
import WalkPathWritePage from "./pages/walkPath/WalkPathWritePage";
import WalkDiaryCalendarPage from "./pages/walkDiary/WalkDiaryCalendarPage";
import RegisterPage from "./pages/user/RegisterPage";
import MainPage from "./pages/MainPage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <HeaderNavbar />

          <Container className="mt-4">
            <Routes>
              {/* 메인 페이지 */}
              <Route path="/" element={<MainPage />} />

              <Route path="/login" element={<LoginPage />} />
              {/* 로그인 페이지 */}

              <Route path="/register" element={<RegisterPage />} />
              {/* 로그인 페이지 */}

              <Route path="/login" element={<LoginPage />} />

              {/* 산책 경로 관련 */}
              <Route path="/walk-paths" element={<WalkPathMainPage />} />

              <Route path="/walk-paths/:id" element={<WalkPathDetailPage />} />
              <Route path="/walk-paths/write" element={<WalkPathWritePage />} />

              {/* 친구 상세 */}
              {/* 산책 경로 상세 페이지 */}
              <Route path="/walkpath/:id" element={<WalkPathDetailPage />} />

              <Route path="/walk-diaries" element={<WalkDiaryCalendarPage />} />
              {/* <Route path="/login" element={<LoginPage />} /> */}
              <Route path="/taily-friends" element={<TailyFriendsMainPage />} />
              <Route
                path="/taily-friends/:id"
                element={<TailyFriendsDetailPage />}
              />
              <Route
                path="/taily-friends/write"
                element={<TailyFriendsWritePage />}
              />

              {/* 산책 일지 작성 */}
              <Route
                path="/walk-diaries/:id"
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
