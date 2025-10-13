import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/image/taily_logo.png";
import "../../styles/HeaderNavbar.css";

const HeaderNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // 나중에 유저 로그인 인증 추가 후 추가

  // 현재 경로와 일치하는 링크 스타일 반환
  // const isActive = (path) => {
  //   return location.pathname === path ? "nav-link-active" : "nav-link";
  // };

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* 왼쪽: 로고 */}
      <div className="navbar-brand">
        <Link to="/" className="logo-link">
          <img
            src={logo}
            alt="Taily Logo"
            className="logo-img"
            style={{ width: "120px", height: "70px", marginLeft: "80px" }}
          />
        </Link>
      </div>

      {/* 가운데: 네비게이션 탭 */}
      <div className="navbar-links">
        {/* 펫스토리 */}
        <div className="dropdown">
          <Link
            to="/petstory/feed"
            className={
              location.pathname.startsWith("/petstory/feed") ||
              location.pathname.startsWith("/chats")
                ? "nav-link-active"
                : "nav-link"
            }
          >
            펫스토리
          </Link>
          <div className="dropdown-menu">
            <Link to="/petstory/feed" className="dropdown-item">
              피드
            </Link>
            <Link to="/chats" className="dropdown-item">
              대화방
            </Link>
          </div>
        </div>

        {/* 산책 공간 */}
        <div className="dropdown">
          <Link
            to="/diary"
            className={
              location.pathname.startsWith("/walk-diaries") ||
              location.pathname.startsWith("/taily-friends") ||
              location.pathname.startsWith("/walk-paths")
                ? "nav-link-active"
                : "nav-link"
            }
          >
            산책 공간
          </Link>
          <div className="dropdown-menu">
            <Link to="/walk-diaries" className="dropdown-item">
              산책일지
            </Link>
            <Link to="/taily-friends" className="dropdown-item">
              테일리프렌즈
            </Link>
            <Link to="/walk-paths" className="dropdown-item">
              다함께산책
            </Link>
          </div>
        </div>

        {/* 우리동네정보 */}
        <div className="dropdown">
          <Link
            to="/facilities"
            className={
              location.pathname.startsWith("/facilities")
                ? "nav-link-active"
                : "nav-link"
            }
          >
            우리동네정보
          </Link>
        </div>

        {/* 이벤트 */}
        <div className="dropdown">
          <Link
            to="/event"
            className={
              location.pathname.startsWith("/event")
                ? "nav-link-active"
                : "nav-link"
            }
          >
            이벤트
          </Link>
        </div>

        {/* 고객센터 */}
        <div className="dropdown">
          <Link
            to="/inquiry"
            className={
              location.pathname.startsWith("/inquiry") ||
              location.pathname.startsWith("/notices")
                ? "nav-link-active"
                : "nav-link"
            }
          >
            고객센터
          </Link>
          <div className="dropdown-menu">
            <Link to="/notices" className="dropdown-item">
              공지사항
            </Link>
            <Link to="/inquiry" className="dropdown-item">
              문의하기
            </Link>
          </div>
        </div>
      </div>

      {/* 오른쪽 버튼 영역 */}
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="welcome-text">{user.nickname}님 환영합니다!</span>
            <Link to="/mypage/main">
              <button className="btn btn-outline-primary btn-sm me-3 btn-signup">
                My Page
              </button>
            </Link>
            <button
              className="btn btn-primary btn-sm me-3 btn-login"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">
              <button className="btn btn-outline-primary btn-sm me-3 btn-signup">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-primary btn-sm me-3 btn-login">
                Login
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default HeaderNavbar;
