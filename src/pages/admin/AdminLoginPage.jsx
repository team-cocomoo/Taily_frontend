import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import "../../styles/admin/Admin.css";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/admin/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const bearerToken = response.headers["authorization"];
      if (!bearerToken) throw new Error("토큰이 존재하지 않습니다.");

      localStorage.setItem("token", bearerToken.replace("Bearer ", ""));
      if (response.data.success) navigate("/admin/main");
      else navigate("/admin/login");
    } catch (error) {
      console.error("로그인 실패:", error);
      setError(error.response?.data?.message || "로그인 실패: 아이디/비밀번호 확인");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper d-flex justify-content-center align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={4}>
            <Card className="login-card shadow">
              <Card.Body>
                <Card.Title className="text-center mb-4">Taily Admin Login</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>아이디</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="아이디 입력"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="비밀번호 입력"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    {loading ? "로그인 중..." : "로그인"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLoginPage;
