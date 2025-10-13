import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      navigate("/mypage/main");
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
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <h3 className="text-center mb-4">로그인</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
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

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
