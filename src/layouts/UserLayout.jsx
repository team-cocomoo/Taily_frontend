import React from "react";
import { Outlet } from "react-router-dom";
import HeaderNavbar from "../components/common/HeaderNavbar";
import Footer from "../components/common/Footer";
import "../styles/layout/UserLayout.css";

const UserLayout = () => {
  return (
    <div className="user-layout">
      <HeaderNavbar />
      <main className="container py-4 user-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
