import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import logo from "../../assets/image/tailylogo.png";
import hamburgerIcon from "../../assets/image/hamburger-menu-icon.png";

import "../../styles/HeaderNavbar.css";
import AlarmSystem from "./alarm/AlarmSystem";

const HeaderNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // 화면 크기 체크
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
      setOpenDropdowns({});
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) setShowHeader(false);
    else setShowHeader(true);
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const MenuLinks = () => (
    <>
      <div className="dropdown">
        <span className="nav-link" onClick={() => toggleDropdown("petstory")}>
          펫스토리
        </span>
        <div
          className={`dropdown-menu ${openDropdowns["petstory"] ? "open" : ""}`}
        >
          <Link
            to="/petstory/feed"
            className="dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            피드
          </Link>
          <Link
            to="/chats"
            className="dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            대화방
          </Link>
        </div>
      </div>

      <div className="dropdown">
        <span className="nav-link" onClick={() => toggleDropdown("walk")}>
          산책 공간
        </span>
        <div className={`dropdown-menu ${openDropdowns["walk"] ? "open" : ""}`}>
          <Link
            to="/walk-diaries"
            className="dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            산책일지
          </Link>
          <Link
            to="/taily-friends"
            className="dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            테일리프렌즈
          </Link>
          <Link
            to="/walk-paths"
            className="dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            다함께산책
          </Link>
        </div>
      </div>
      <Link
        to="/facilities"
        className="nav-link"
        onClick={() => setMenuOpen(false)}
      >
        우리동네정보
      </Link>
      <div className="dropdown">
        <span className="nav-link" onClick={() => toggleDropdown("center")}>
          고객센터
        </span>
        <div
          className={`dropdown-menu ${openDropdowns["center"] ? "open" : ""}`}
        >
          <Link
            to="/notices"
            className="dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            공지사항
          </Link>
          <Link
            to="/faqs"
            className="dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            FAQ
          </Link>
        </div>
      </div>

      <Link to="/event" className="nav-link" onClick={() => setMenuOpen(false)}>
        이벤트
      </Link>
    </>
  );

  const UserActions = () => (
    <div className="navbar-actions">
      {user ? (
        <>
          {/*<span className="welcome-text">{user.nickname}님 환영합니다!</span>*/}
          <AlarmSystem />
          <Link to="/mypage/user" onClick={() => setMenuOpen(false)}>
            <button className="btn btn-outline-primary btn-sm btn-signup">
              My Page
            </button>
          </Link>
          <button
            className="btn btn-primary btn-sm btn-login"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/register" onClick={() => setMenuOpen(false)}>
            <button className="btn btn-outline-primary btn-sm btn-signup">
              Sign Up
            </button>
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <button className="btn btn-primary btn-sm btn-login">Login</button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className={`navbar header ${showHeader ? "visible" : "hidden"}`}>
      <div className="navbar-brand">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Taily Logo" />
        </Link>
      </div>

      {isMobile ? (
        <>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={hamburgerIcon} alt="Menu" className="hamburger-icon" />
          </div>

          {menuOpen && (
            <div className="mobile-menu">
              <MenuLinks />
              <UserActions />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="navbar-links">
            <MenuLinks />
          </div>
          <UserActions />
        </>
      )}
    </nav>
  );
};

export default HeaderNavbar;
