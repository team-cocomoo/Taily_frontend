// src/components/mypage/UserProfileHeader.jsx
import React from "react";
import "@/styles/mypage/UserProfileHeader.css";

const UserProfileHeader = ({ userInfo }) => {
  return (
    <div className="user-profile-header text-center mb-4">
      <img
        src={userInfo?.profileImageUrl || "/default-profile.png"}
        alt="유저 프로필"
        className="profile-image mb-2"
      />
      
    </div>
  );
};

export default UserProfileHeader;
