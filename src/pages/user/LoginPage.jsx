import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/user/LoginPage.css";
import tailylogo from "../../assets/image/tailylogo.svg";

const LoginPage = () => {
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

      // JWT 가져오기
      const bearerToken = res.headers["authorization"];
      if (!bearerToken) throw new Error("토큰이 존재하지 않습니다.");

      const token = bearerToken.replace("Bearer ", "");
      localStorage.setItem("token", token);

      // 2. 사용자 정보 조회
      const userRes = await axios.get("http://localhost:8080/api/mypage/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userRes.data.data; // UserProfileResponseDto 구조 확인 필요

      // 로그인 성공 → 마이페이지 이동
      navigate("/");
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
      <div className="text-center mb-4">
        {/* 중앙 로고 - SVG 이미지로 변경 */}
        <img
          src={tailylogo}
          alt="Taily Logo"
          className="img-fluid" // Bootstrap의 반응형 이미지 클래스
          style={{ width: "250px", height: "auto" }} // 원하는 크기로 조정
        />
      </div>
      <div className="text-center">
        <Card className="loginformbox">
          <Card.Body>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3 justify-content-center">
                <Form.Label column sm={2}>
                  아이디
                </Form.Label>
                <Col sm={5}>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="logininputfield"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3 justify-content-center">
                <Form.Label column sm={2}>
                  비밀번호
                </Form.Label>
                <Col sm={5}>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="logininputfield"
                  />
                </Col>
              </Form.Group>

              {/* 로그인, 소셜 로그인 버튼 */}
              <Row className="mb-4 justify-content-center ">
                <Col xs="auto" className="p-0 me-5">
                  <Button
                    type="submit"
                    variant="warning"
                    className="loginbutton"
                  >
                    로그인
                  </Button>
                </Col>
                <Col xs="auto" className="p-0">
                  <Button
                    variant="warning"
                    className="loginbutton"
                    onClick={() => navigate("/oauth2/authorization/kakao")}
                  >
                    소셜 로그인
                  </Button>
                </Col>
              </Row>
              <Row className="mb-4 justify-content-center">
                <Col xs="auto" className="p-0 me-5">
                  <Button
                    variant="warning"
                    className="findbutton"
                    onClick={() => navigate("/findid")}
                  >
                    아이디 찾기
                  </Button>
                </Col>
                <Col xs="auto" className="p-0 me-5">
                  <Button
                    variant="warning"
                    className="findbutton"
                    onClick={() => navigate("/findpassword")}
                  >
                    비밀번호 찾기
                  </Button>
                </Col>
                <Col xs="auto" className="p-0">
                  <Button
                    variant="warning"
                    className="findbutton"
                    onClick={() => navigate("/register")}
                  >
                    회원가입
                  </Button>
                </Col>
              </Row>

              {/* <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button> */}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
