import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
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
      const response = await api.post("/api/auth/login/admin", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const bearerToken = response.headers["authorization"];
      if (!bearerToken) throw new Error("토큰이 존재하지 않습니다.");

      localStorage.setItem("token", bearerToken.replace("Bearer ", ""));
      if (response.data.success) navigate("/admin/main");
      else navigate("/admin/login");
    } catch (error) {
      console.error("로그인 실패:", error);
      setError(
        error.response?.data?.message || "로그인 실패: 아이디/비밀번호 확인"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page-container">
      <Card className="admin-loginformbox">
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handleLogin} className="admin-login-form-vertical">
            {/* 아이디 */}
            <Form.Group
              as={Row}
              className="mb-3 justify-content-center form-group-centered"
            >
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
                  className="admin-logininputfield"
                />
              </Col>
            </Form.Group>

            {/* 비밀번호 */}
            <Form.Group
              as={Row}
              className="mb-3 justify-content-center form-group-centered"
            >
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
                  className="admin-logininputfield"
                />
              </Col>
            </Form.Group>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              className="admin-loginbutton"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
