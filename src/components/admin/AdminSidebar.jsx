import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import hamburgerIcon from "../../assets/image/hamburger-menu-icon.png";
import "../../styles/admin/Admin.css";


const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

    // 사이드 메뉴 목록
    const navItems = [
        { key: "users", label: "회원 관리", path: "/admin/main/users" },
        { key: "notices", label: "공지사항 관리", path: "/admin/main/notices" },
        { key: "faqs", label: "FAQ 관리", path: "/admin/main/faqs" },
        { key: "inquiries", label: "1대1 문의 관리", path: "/admin/main/inquiries" },
        { key: "reports", label: "신고 관리", path: "/admin/main/reports" },
        { key: "events", label: "이벤트 관리", path: "/admin/main/events" },
    ];

    // 화면 크기 변화 감지 (반응형)
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 메뉴 클릭 시 이동 및 모바일 메뉴 닫기
    const handleMenuClick = (path) => {
        navigate(path);
        if (isMobile) setShowMenu(false);
    };

    return (
        <>
            <Navbar 
                bg="primary"
                variant='dark'
                expand="lg"
                className="flex-column align-items-start admin-sidebar-navbar"
            >
                <Container fluid className='flex-column align-items-start p-0'>
                    <Navbar.Brand
                        className='w-100 text-center bg-light py-3 mb-2'
                        onClick={() => navigate("/admin/main")}
                        style={{ cursor: "pointer" }}
                    >
                        <span style={{ width: "140px" }}>
                            taily admin service
                        </span>
                    </Navbar.Brand>
                    {/* 모바일용 햄버거 */}
                    <Navbar.Toggle
                        aria-controls='offcanvasNavbar'
                        className='ms-3'
                        onClick={() => setShowMenu(true)}
                    >
                        <img 
                            src={hamburgerIcon}
                            alt="menu"
                            style={{ width: "24px", height: "24px" }}
                        />
                    </Navbar.Toggle>

                    {!isMobile && (
                        <Nav className='flex-column w-100 px-3 admin-nav-list'>
                            {navItems.map((item) => (
                                <Nav.Link
                                    key={item.key}
                                    onClick={() => handleMenuClick(item.path)}
                                    active={location.pathname.includes(item.path)}
                                    className={`my-1 py-2 rounded ${
                                        location.pathname.includes(item.path)
                                        ? "bg-warning text-dark fw-bold"
                                        : "text-white"
                                    }`}
                                >
                                    {item.label}
                                </Nav.Link>
                            ))}
                        </Nav>
                    )}
                </Container>
            </Navbar>

            {/* 모바일 용 Offcanvas 메뉴 */}
            <Offcanvas
                show={showMenu}
                onHide={() => setShowMenu(false)}
                placement='start'
                className="admin-offcanvas"
            >
                <Offcanvas.Header>
                    <Offcanvas.Title>관리자 메뉴</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className='flex-column'>
                        {navItems.map((item) => (
                            <Nav.Link
                                key={item.key}
                                onClick={() => handleMenuClick(item.path)}
                                active={location.pathname.includes(item.path)}
                                className={`my-1 py-2 rounded ${
                                    location.pathname.includes(item.path)
                                        ? "bg-warning text-dark fw-bold"
                                        : "text-dark"
                                }`}
                            >
                                {item.label}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Offcanvas.Body>

            </Offcanvas>
        </>
    );
};

export default AdminSidebar;