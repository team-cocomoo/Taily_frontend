// src/routes/UserRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import ProtectedLayout from "@/components/common/ProtectedLayout";

// 일반 사용자 페이지
import MainPage from "@/pages/MainPage";
import LoginPage from "@/pages/user/LoginPage";
import RegisterPage from "@/pages/user/RegisterPage";
import MyPageUserInfo from "@/pages/mypage/MyPageUserInfo";
import MyWalkPathsPage from "@/pages/mypage/MyWalkPathsPage";
import MyTailyFriendsPage from "@/pages/mypage/MyTailyFriendsPage";
import MyFollowPage from "@/pages/mypage/MyFollowPage";
import MyInquiryPage from "@/pages/mypage/MyInquiryPage";
import PasswordVerifyPage from "@/pages/mypage/PasswordVerifyPage";
import MyPageEdit from "@/pages/mypage/MyPageEdit";
import AccountDeleteSuccessPage from "@/pages/mypage/AccountDeleteSuccessPage";

import WalkDiaryCalendarPage from "@/pages/walkDiary/WalkDiaryCalendarPage";
import WalkDiaryWritePage from "@/pages/walkDiary/WalkDiaryWritePage";
import WalkDiaryDetailPage from "@/pages/walkDiary/WalkDiaryDetailPage";
import WalkDiaryUpdatePage from "@/pages/walkDiary/WalkDiaryUpdatePage";
import WalkDiaryStatisticsPage from "@/pages/walkDiary/WalkDiaryStatisticsPage";

import WalkPathMainPage from "@/pages/walkPath/WalkPathMainPage";
import WalkPathDetailPage from "@/pages/walkPath/WalkPathDetailPage";
import WalkPathWritePage from "@/pages/walkPath/WalkPathWritePage";
import WalkPathEditPage from "@/pages/walkPath/WalkPathEditPage";

import TailyFriendsMainPage from "@/pages/tailyFriends/TailyFriendsMainPage";
import TailyFriendsDetailPage from "@/pages/tailyFriends/TailyFriendsDetailPage";
import TailyFriendsWritePage from "@/pages/tailyFriends/TailyFriendsWritePage";
import TailyFriendsEditPage from "@/pages/tailyFriends/TailyFriendsEditPage";
import ChatRoomMainPage from "@/pages/chatroom/ChatRoomMainPage";
import ChatRoomDetailPage from "@/pages/chatroom/ChatRoomDetailPage";
import FacilityMainPage from "@/pages/facilities/FacilitiesMainPage";
import OtherUserProfilePage from "@/pages/user/OtherUserProfilePage";

import FeedMainPage from "@/pages/feed/FeedMainPage";
import FeedDetailPage from "@/pages/feed/FeedDetailPage";
import FeedEdtiPage from "@/pages/feed/FeedEdtiPage";
import FeedWritePage from "@/pages/feed/FeedWritePage";

import NoticeListPage from "@/pages/cs/NoticeListPage";
import NoticeDetailPage from "@/pages/cs/NoticeDetailPage";
import FaqPage from "@/pages/cs/FaqPage";
import EventPage from "@/pages/cs/EventPage";

import SingleFeedUploader from "@/tests/pages/SingleFeedUploader";
import MyLikePage from "@/pages/mypage/MyLikePage";
import MyPetPage from "@/pages/mypage/MyPetPage";
import MyPageMyFeed from "@/pages/mypage/MyPageMyFeed";
import MyFeedPage from "@/pages/mypage/MyFeedPage";

const UserRoutes = (
  <Route element={<UserLayout />}>
    {/* 공용 페이지 (비회원 가능) */}
    <Route path="/" element={<MainPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/notices" element={<NoticeListPage />} />
    <Route path="/notices/:id" element={<NoticeDetailPage />} />
    <Route path="/event" element={<EventPage />} />
    <Route path="/faqs" element={<FaqPage />} />
    <Route path="/SingleFeedUploader" element={<SingleFeedUploader />} />

    {/* 회원 전용 페이지 */}
    <Route element={<ProtectedLayout roles={["ROLE_USER"]} />}>
      <Route path="/mypage/user" element={<MyPageUserInfo />} />
      <Route path="/mypage/user/edit" element={<MyPageEdit />} />
      <Route path="/mypage/myfeed" element={<MyFeedPage />} />
      <Route path="/mypage/pet" element={<MyPetPage />} />
      <Route path="/mypage/like" element={<MyLikePage />} />
      <Route path="/mypage/walk-paths" element={<MyWalkPathsPage />} />
      <Route path="/mypage/taily-friends" element={<MyTailyFriendsPage />} />
      <Route path="/mypage/inquiries" element={<MyInquiryPage />} />
      <Route path="/mypage/follow-following" element={<MyFollowPage />} />
      <Route path="/mypage/password-verify" element={<PasswordVerifyPage />} />
      <Route
        path="/mypage/delete-success"
        element={<AccountDeleteSuccessPage />}
      />
      <Route path="/mypage/myPagemyFeed" element={<MyPageMyFeed />} />

      {/* 펫스토리 */}
      <Route path="/petstory/feed" element={<FeedMainPage />} />
      <Route path="/petstory/feed/write" element={<FeedWritePage />} />
      <Route path="/petstory/feed/edit/:id" element={<FeedEdtiPage />} />

      {/* 산책 관련 */}
      <Route path="/walk-diaries" element={<WalkDiaryCalendarPage />} />
      <Route
        path="/walk-diaries/write/:date"
        element={<WalkDiaryWritePage />}
      />
      <Route path="/walk-diaries/:id" element={<WalkDiaryDetailPage />} />
      <Route path="/walk-diaries/edit/:id" element={<WalkDiaryUpdatePage />} />
      <Route path="/walk-diaries/stats" element={<WalkDiaryStatisticsPage />} />

      <Route path="/walk-paths" element={<WalkPathMainPage />} />
      <Route path="/walk-paths/write" element={<WalkPathWritePage />} />
      <Route path="/walk-paths/edit/:id" element={<WalkPathEditPage />} />

      {/* 커뮤니티 */}
      <Route path="/taily-friends" element={<TailyFriendsMainPage />} />
      <Route path="/taily-friends/write" element={<TailyFriendsWritePage />} />
      <Route
        path="/taily-friends/edit/:id"
        element={<TailyFriendsEditPage />}
      />

      {/* 기타 */}
      <Route path="/facilities" element={<FacilityMainPage />} />
      <Route path="/chats" element={<ChatRoomMainPage />} />
      <Route path="/chats/:id" element={<ChatRoomDetailPage />} />
      <Route
        path="/user-profile/:id/profile"
        element={<OtherUserProfilePage />}
      />
    </Route>
    <Route element={<ProtectedLayout roles={["ROLE_USER", "ROLE_ADMIN"]} />}>
      <Route path="/taily-friends/:id" element={<TailyFriendsDetailPage />} />
      <Route path="/petstory/feed/:id" element={<FeedDetailPage />} />
      <Route path="/walk-paths/:id" element={<WalkPathDetailPage />} />
    </Route>
  </Route>
);

export default UserRoutes;
