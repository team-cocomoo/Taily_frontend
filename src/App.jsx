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
import MyTailyFriendsPage from "./pages/myPage/MyTailyFriendsPage";
import MyFollowPage from "./pages/myPage/MyFollowPage";
import MyInquiryPage from "./pages/myPage/MyInquiryPage";
import PasswordVerifyPage from "@/pages/mypage/PasswordVerifyPage";
import MyPageEdit from "@/pages/mypage/MyPageEdit";
import AccountDeleteSuccessPage from "@/pages/mypage/AccountDeleteSuccessPage";

import WalkDiaryCalendarPage from "./pages/walkDiary/WalkDiaryCalendarPage";
import WalkDiaryWritePage from "./pages/walkDiary/WalkDiaryWritePage";
import WalkDiaryDetailPage from "./pages/walkDiary/WalkDiaryDetailPage";
import WalkDiaryUpdatePage from "./pages/walkDiary/WalkDiaryUpdatePage";
import WalkDiaryStatisticsPage from "./pages/walkDiary/WalkDiaryStatisticsPage";

import WalkPathMainPage from "./pages/walkPath/WalkPathMainPage";
import WalkPathDetailPage from "./pages/walkPath/WalkPathDetailPage";
import WalkPathWritePage from "./pages/walkPath/WalkPathWritePage";
import WalkPathEditPage from "./pages/walkPath/WalkPathEditPage";

import TailyFriendsMainPage from "./pages/tailyFriends/TailyFriendsMainPage";
import TailyFriendsDetailPage from "./pages/tailyFriends/TailyFriendsDetailPage";
import TailyFriendsWritePage from "./pages/tailyFriends/TailyFriendsWritePage";
import TailyFriendsEditPage from "./pages/tailyFriends/TailyFriendsEditPage";
import ChatRoomMainPage from "./pages/chatroom/ChatRoomMainPage";
import ChatRoomDetailPage from "./pages/chatroom/ChatRoomDetailPage";
import FacilityMainPage from "./pages/facilities/FacilitiesMainPage";
import OtherUserProfilePage from "./pages/user/OtherUserProfilePage";

import FeedMainPage from "./pages/feed/FeedMainPage";
import FeedDetailPage from "./pages/feed/FeedDetailPage";
import FeedEdtiPage from "./pages/feed/FeedEdtiPage";
import FeedWritePage from "./pages/feed/FeedWritePage";

// 공지사항
import NoticeListPage from "./pages/cs/NoticeListPage";
import NoticeDetailPage from "./pages/cs/NoticeDetailPage";

// 관리자
import AdminMainPage from "./pages/admin/AdminMainPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
//import FeedWritePage from "./pages/feed/FeedWritePage";
import FaqPage from "./pages/cs/FaqPage";
import AdminFaqPage from "./pages/admin/faq/AdminFaqPage";
import AdminFaqDetailPage from "./pages/admin/faq/AdminFaqDetailPage";
import { Users } from "lucide-react";

// 테스트
import SingleFeedUploader from "./tests/pages/SingleFeedUploader";
import MyLikePage from "./pages/myPage/MyLikePage";
import MyPetPage from "./pages/myPage/MyPetPage";

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

            {/* 테스트 */}
            <Route
              path="/SingleFeedUploader"
              element={<SingleFeedUploader />}
            />

            {/* 사용자 권한 필요 페이지 */}
            <Route element={<ProtectedLayout roles={["ROLE_USER"]} />}>
              <Route path="/mypage/user" element={<MyPageUserInfo />} />
              <Route path="/mypage/user/edit" element={<MyPageEdit />} />
              <Route path="/mypage/pet" element={<MyPetPage />} />
              <Route path="/mypage/like" element={<MyLikePage />} />
              <Route
                path="/mypage/taily-friends"
                element={<MyTailyFriendsPage />}
              />
              <Route path="/mypage/inquiries" element={<MyInquiryPage />} />
              <Route
                path="/mypage/follow-following"
                element={<MyFollowPage />}
              />
              <Route
                path="/mypage/password-verify"
                element={<PasswordVerifyPage />}
              />
              <Route
                path="/mypage/delete-success"
                element={<AccountDeleteSuccessPage />}
              />

              {/* 펫스토리 페이지 */}
              <Route path="/petstory/feed" element={<FeedMainPage />} />
              <Route path="/petstory/feed/write" element={<FeedWritePage />} />
              <Route
                path="/petstory/feed/edit/:id"
                element={<FeedEdtiPage />}
              />

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
              {/* 산책경로 routes */}
              <Route path="walk-paths" element={<WalkPathMainPage />} />
              <Route path="walk-paths/write" element={<WalkPathWritePage />} />

              <Route
                path="walk-paths/edit/:id"
                element={<WalkPathEditPage />}
              />

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
              path="taily-friends/:id"
              element={<TailyFriendsDetailPage />}
            />
            <Route path="walk-paths/:id" element={<WalkPathDetailPage />} />
            <Route path="/petstory/feed/:id" element={<FeedDetailPage />} />
            <Route path="/notices" element={<NoticeListPage />} />
            <Route path="/notices/:id" element={<NoticeDetailPage />} />
            {/* <Route
              element={<ProtectedLayout roles={["ROLE_USER", "ROLE_ADMIN"]} />}
            ></Route> */}
          </Route>

          {/* 관리자 레이아웃 */}
          <Route path="admin" element={<AdminLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedLayout roles={["ROLE_ADMIN"]} />}>
              <Route path="main/*" element={<AdminMainPage />} />
            </Route>
          </Route>
        </Routes>
        {/* </Container> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
