// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// AuthProvider import
import AuthProvider from "./contexts/AuthProvider";

// 레이아웃 컴포넌트
import HeaderNavbar from "./components/common/HeaderNavbar";
import Footer from "./components/common/Footer";
import WalkDiaryWritePage from "./pages/walkdiary/WalkDiaryWritePage";

// 페이지 컴포넌트
import TailyFriendsDetailPage from "./pages/tailyFriends/TailyFriendsDetailPage";
import LoginPage from "./pages/user/LoginPage";
import WalkPathMainPage from "./pages/walkPath/WalkPathMainPage";
import WalkPathDetailPage from "./pages/walkPath/WalkPathDetailPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <HeaderNavbar />
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              {/* 로그인 페이지 */}
              <Route path="/login" element={<LoginPage />} />
              {/* 산책경로 페이지 */}
              <Route path="/walk-paths" element={<WalkPathMainPage />} />
              {/* 산책 경로 상세 페이지 */}
              <Route path="/walkpath/:id" element={<WalkPathDetailPage />} />
              <Route
                path="/taily-friends/:id"
                element={<TailyFriendsDetailPage />}
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
