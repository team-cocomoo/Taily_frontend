// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* 첫 번째 줄: 메뉴 */}
      <div className="footer-menu">
        <Link to="/" className="footer-link">
          Home
        </Link>
        <a
          href="https://github.com/team-cocomoo/Taily_frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
        <a
          href="https://programdoc.notion.site/KOSA-26423df9642580f9ad0ff72c28067bb3?source=copy_link"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Notion
        </a>
      </div>

      {/* 두 번째 줄: 회사 정보 */}
      <div className="footer-company">
        <p><strong>cocomoo</strong></p>
        <p>코드에 코드를 무는 사람들</p>
        <p>김범준 송예은 오현승 전상욱</p>
        
      </div>

      {/* 세 번째 줄: 카피라이트 */}
      <div className="footer-copyright">
        &copy; 2025 Taily. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
