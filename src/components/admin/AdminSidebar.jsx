import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Navbar, Offcanvas, Button } from "react-bootstrap";
import axios from "axios";
import hamburgerIcon from "../../assets/image/hamburger-menu-icon.png";
import "../../styles/admin/Admin.css";

const AdminSidebar = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // ✅ 사이드 메뉴 목록
  const navItems = [
    { key: "users", label: "회원 관리", path: "/admin/main/users" },
    { key: "notices", label: "공지사항 관리", path: "/admin/main/notices" },
    { key: "faqs", label: "FAQ 관리", path: "/admin/main/faqs" },
    {
      key: "inquiries",
      label: "1대1 문의 관리",
      path: "/admin/main/inquiries",
    },
    { key: "reports", label: "신고 관리", path: "/admin/main/reports" },
    { key: "events", label: "이벤트 관리", path: "/admin/main/events" },
  ];

  // ✅ 반응형 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ 모바일 메뉴 닫기
  const handleCloseMenu = () => setShowMenu(false);

    // ✅ 로그아웃 처리
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "/api/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      // 토큰 제거
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      alert("로그아웃되었습니다.");
      navigate("/admin/login");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {/* === 사이드바 === */}
      <Navbar
        bg="primary"
        variant="dark"
        expand="lg"
        className="flex-column align-items-start admin-sidebar-navbar"
      >
        <Container fluid className="flex-column align-items-start p-0 container-fluid">
          {/* 로고 */}
          <div
            className="admin-logo"
            style={{ cursor: "pointer" }}
          >
            <Link to="/admin/main/users" className="text-dark text-decoration-none">
              <span style={{ fontWeight: "600" }}>taily admin service</span>
            </Link>
          </div>

          {/* 모바일용 햄버거 */}
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            className="ms-3"
            onClick={() => setShowMenu(true)}
          >
            <img
              src={hamburgerIcon}
              alt="menu"
              style={{ width: "24px", height: "24px" }}
            />
          </Navbar.Toggle>

          {/* 데스크탑용 메뉴 */}
          {!isMobile && (
            <>
            <nav className="flex-column w-100 px-3 admin-nav-list">
              {navItems.map((item) => {
                const active = location.pathname.includes(item.path);
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`nav-link my-1 py-2 rounded ${
                      active
                        ? "text-dark fw-bold nav-link-active"
                        : "text-white text-decoration-none"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
              <div className="w-100 px-3 mt-3">
                <Button
                  variant="outline-light"
                  size="sm"
                  className="w-100"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            </>
            
          )}
        </Container>
      </Navbar>

      {/* === 모바일 메뉴 === */}
      <Offcanvas
        show={showMenu}
        onHide={handleCloseMenu}
        placement="start"
        className="admin-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>관리자 메뉴</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <nav className="flex-column">
            {navItems.map((item) => {
              const active = location.pathname.includes(item.path);
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={handleCloseMenu}
                  className={`nav-link my-1 py-2 rounded ${
                    active
                      ? "bg-warning text-dark fw-bold"
                      : "text-dark text-decoration-none"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AdminSidebar;
