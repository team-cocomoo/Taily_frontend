import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthProvider from "../src/contexts/AuthProvider";

import HeaderNavbar from "./components/common/HeaderNavbar";
import Footer from "./components/common/Footer";
import ProtectedLayout from "./components/common/ProtectedLayout";

// 페이지 컴포넌트
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import MyPageUserInfo from "./pages/myPage/MyPageUserInfo";

import WalkDiaryCalendarPage from "./pages/walkdiary/WalkDiaryCalendarPage";
import WalkDiaryWritePage from "./pages/walkDiary/WalkDiaryWritePage";
import WalkDiaryDetailPage from "./pages/walkDiary/WalkDiaryDetailPage";

import WalkPathMainPage from "./pages/walkPath/WalkPathMainPage";
import WalkPathDetailPage from "./pages/walkPath/WalkPathDetailPage";
import WalkPathWritePage from "./pages/walkPath/WalkPathWritePage";
import TailyFriendsMainPage from "./pages/tailyFriends/TailyFriendsMainPage";
import TailyFriendsDetailPage from "./pages/tailyFriends/TailyFriendsDetailPage";
import TailyFriendsWritePage from "./pages/tailyFriends/TailyFriendsWritePage";
import TailyFriendsEditPage from "./pages/tailyFriends/TailyFriendsEditPage";
import ChatRoomMainPage from "./pages/chatroom/ChatRoomMainPage";
import FacilityMainPage from "./pages/facilities/FacilitiesMainPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HeaderNavbar />
        <Container className="mt-4">
          <Routes>
            {/* 공용 페이지 */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 사용자 권한 영역 */}
            <Route element={<ProtectedLayout roles={["ROLE_USER"]} />}>
              <Route path="/mypage/main" element={<MyPageUserInfo />} />
              <Route path="/walk-diaries" element={<WalkDiaryCalendarPage />} />
              <Route
                path="/walk-diaries/write/:date"
                element={<WalkDiaryWritePage />}
              />
              <Route
                path="/walk-diaries/:date"
                element={<WalkDiaryDetailPage />}
              />

              <Route path="/walk-paths" element={<WalkPathMainPage />} />
              <Route path="/walk-paths/:id" element={<WalkPathDetailPage />} />
              <Route path="/walk-paths/write" element={<WalkPathWritePage />} />
              <Route path="/taily-friends" element={<TailyFriendsMainPage />} />
              <Route path="/facilities" element={<FacilityMainPage />} />
              <Route
                path="/taily-friends/:id"
                element={<TailyFriendsDetailPage />}
              />
              <Route
                path="/taily-friends/write"
                element={<TailyFriendsWritePage />}
              />
              <Route
                path="/taily-friends/edit/:id"
                element={<TailyFriendsEditPage />}
              />
              <Route path="/chats" element={<ChatRoomMainPage />} />
            </Route>

            {/* 관리자 권한 영역 */}
            <Route element={<ProtectedLayout roles={["ROLE_ADMIN"]} />}>
              {/* <Route path="/admin/main" element={<AdminMainPage />} /> */}
            </Route>
          </Routes>
        </Container>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
