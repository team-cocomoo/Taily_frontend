import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthProvider from "../src/contexts/AuthProvider";

// import HeaderNavbar from "./components/common/HeaderNavbar";
// import Footer from "./components/common/Footer";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedLayout from "./components/common/ProtectedLayout";
import AdminProtectedLayout from "./components/common/AdminProtectedLayout";

// 페이지 컴포넌트
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import MyPageUserInfo from "./pages/myPage/MyPageUserInfo";

import WalkDiaryCalendarPage from "./pages/walkDiary/WalkDiaryCalendarPage";
import WalkDiaryWritePage from "./pages/walkDiary/WalkDiaryWritePage";
import WalkDiaryDetailPage from "./pages/walkDiary/WalkDiaryDetailPage";
import WalkDiaryUpdatePage from "./pages/walkDiary/WalkDiaryUpdatePage";
import WalkDiaryStatisticsPage from "./pages/walkDiary/WalkDiaryStatisticsPage";

import WalkPathMainPage from "./pages/walkPath/WalkPathMainPage";
import WalkPathDetailPage from "./pages/walkPath/WalkPathDetailPage";
import WalkPathWritePage from "./pages/walkPath/WalkPathWritePage";
import TailyFriendsMainPage from "./pages/tailyFriends/TailyFriendsMainPage";
import TailyFriendsDetailPage from "./pages/tailyFriends/TailyFriendsDetailPage";
import TailyFriendsWritePage from "./pages/tailyFriends/TailyFriendsWritePage";
import TailyFriendsEditPage from "./pages/tailyFriends/TailyFriendsEditPage";
import ChatRoomMainPage from "./pages/chatroom/ChatRoomMainPage";
import ChatRoomDetailPage from "./pages/chatroom/ChatRoomDetailPage";
import FacilityMainPage from "./pages/facilities/FacilitiesMainPage";
import OtherUserProfilePage from "./pages/user/OtherUserProfilePage";

// 관리자
import AdminMainPage from "./pages/admin/AdminMainPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import FeedMainPage from "./pages/feed/FeedMainPage";
import FeedDetailPage from "./pages/feed/FeedDetailPage";
import FeedWritePage from "./pages/feed/FeedWritePage";
import FeedEdtiPage from "./pages/feed/FeedEdtiPage";
import FaqPage from "./pages/cs/FaqPage";

// 테스트 페이지
import LoginPageTest1 from "./pages/user/LoginPageTest1";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <Container className="mt-4"> */}
        <Routes>
          {/* 일반 사용자 레이아웃 */}
          <Route element={<UserLayout />}>
            {/* 공용 페이지 */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* 테스트 페이지 */}
            <Route path="/loginTest1" element={<LoginPageTest1 />} />

            {/* 사용자 권한 필요 페이지 */}
            <Route element={<ProtectedLayout roles={["ROLE_USER"]} />}>
              <Route path="mypage/main" element={<MyPageUserInfo />} />

              {/* 펫스토리 페이지 */}
              <Route path="/mypage/main" element={<MyPageUserInfo />} />
              <Route path="/petstory/feed" element={<FeedMainPage />} />

              <Route
                path="/petstory/feed/edit/:id"
                element={<FeedEdtiPage />}
              />

              <Route path="/petstory/feed/write" element={<FeedWritePage />} />
              <Route path="walk-diaries" element={<WalkDiaryCalendarPage />} />
              <Route
                path="walk-diaries/write/:date"
                element={<WalkDiaryWritePage />}
              />
              <Route
                path="walk-diaries/:id"
                element={<WalkDiaryDetailPage />}
              />
              <Route
                path="walk-diaries/edit/:id"
                element={<WalkDiaryUpdatePage />}
              />
              <Route
                path="walk-diaries/stats"
                element={<WalkDiaryStatisticsPage />}
              />
              <Route path="walk-paths" element={<WalkPathMainPage />} />

              <Route path="walk-paths/write" element={<WalkPathWritePage />} />

              <Route path="facilities" element={<FacilityMainPage />} />

              <Route path="taily-friends" element={<TailyFriendsMainPage />} />
              <Route
                path="taily-friends/write/"
                element={<TailyFriendsWritePage />}
              />
              <Route
                path="taily-friends/edit/:id"
                element={<TailyFriendsEditPage />}
              />

              <Route path="chats" element={<ChatRoomMainPage />} />
              <Route path="chats/:id" element={<ChatRoomDetailPage />} />
              <Route
                path="user-profile/:id/profile"
                element={<OtherUserProfilePage />}
              />

              <Route path="faqs" element={<FaqPage />} />
            </Route>
            <Route
              element={<ProtectedLayout roles={["ROLE_USER", "ROLE_ADMIN"]} />}
            >
              <Route
                path="taily-friends/:id"
                element={<TailyFriendsDetailPage />}
              />
              <Route path="walk-paths/:id" element={<WalkPathDetailPage />} />
              <Route path="/petstory/feed/:id" element={<FeedDetailPage />} />
            </Route>
          </Route>

          {/* 관리자 레이아웃 */}
          <Route path="admin" element={<AdminLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedLayout />}>
              <Route path="main" element={<AdminMainPage />} />
            </Route>
          </Route>
        </Routes>
        {/* </Container> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
