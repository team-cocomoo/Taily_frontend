import React from "react";
import { Outlet } from "react-router-dom";
import HeaderNavbar from '../components/common/HeaderNavbar';
import Footer from '../components/common/Footer';

const UserLayout = () => {
    return (
    <div className="user-layout">
        <HeaderNavbar />
        <main className="container py-4">
        <Outlet />
        </main>
        <Footer />
    </div>
    );
};

export default UserLayout;