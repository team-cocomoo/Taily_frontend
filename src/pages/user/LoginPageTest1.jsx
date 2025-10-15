// src/components/LoginPage-test.js
import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/user/LoginPage.css";
import tailylogo from "../../assets/image/tailylogo.svg";

const LoginPageTest1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const bearerToken = res.headers["authorization"];
      if (!bearerToken) throw new Error("토큰이 존재하지 않습니다.");

      const token = bearerToken.replace("Bearer ", "");
      localStorage.setItem("token", token);

      // 사용자 정보 조회
      const userRes = await axios.get("http://localhost:8080/api/mypage/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/"); // 로그인 성공 시 이동
    } catch (err) {
      console.error("로그인 실패:", err);
      setError(
        err.response?.data?.message || "로그인 실패: 아이디/비밀번호 확인"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page-container">
      {/* 로고 */}
      <div className="text-center mb-4">
        <img
          src={tailylogo}
          alt="Taily Logo"
          className="img-fluid"
          style={{ width: "250px", height: "auto" }}
        />
      </div>

      {/* 로그인 카드 */}
      <Card className="loginformbox">
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <Form.Group className="mb-3">
              <Form.Label>아이디</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* 비밀번호 */}
            <Form.Group className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* 로그인 버튼 */}
            <div className="d-flex justify-content-center mb-3">
              <Button
                type="submit"
                className="loginbutton w-50"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </div>

            {/* 소셜 로그인 버튼 */}
            <div className="d-flex justify-content-center mb-3">
              <Button
                className="loginbutton w-50"
                onClick={() => navigate("/oauth2/authorization/kakao")}
              >
                소셜 로그인
              </Button>
            </div>

            {/* 아이디/비밀번호 찾기 + 회원가입 */}
            <div className="d-flex justify-content-between">
              <Button
                className="findbutton"
                onClick={() => navigate("/findid")}
              >
                아이디 찾기
              </Button>
              <Button
                className="findbutton"
                onClick={() => navigate("/findpassword")}
              >
                비밀번호 찾기
              </Button>
              <Button
                className="findbutton"
                onClick={() => navigate("/register")}
              >
                회원가입
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPageTest1;
