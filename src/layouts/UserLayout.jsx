import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderNavbar from "../components/common/HeaderNavbar";
import Footer from "../components/common/Footer";
import "../styles/layout/UserLayout.css";

const UserLayout = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <div className="user-layout">
      <HeaderNavbar />
      <main
        className={`container ${
          isMainPage ? "no-margin-top" : "user-container"
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
