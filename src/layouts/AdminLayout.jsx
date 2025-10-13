import React from "react";
import { Outlet } from "react-router-dom";

// import "../styles/admin.css"; // 선택

const AdminLayout = () => {
  return (
    <div className="">
      {/* <AdminSidebar /> */}
      <div className="">
        <Outlet /> {/* 여기서 하위 라우트 렌더링 */}
      </div>
    </div>
  );
};

export default AdminLayout;