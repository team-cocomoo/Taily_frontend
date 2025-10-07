import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ProtectedLayout = ({ roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // 초기 로딩 중 처리

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>권한이 없습니다.</h2>
        <p>해당 페이지에 접근할 수 있는 권한이 없습니다.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedLayout;
