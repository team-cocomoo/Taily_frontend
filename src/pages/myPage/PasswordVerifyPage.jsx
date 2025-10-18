import React, { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";

const PasswordVerifyPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/mypage/check-password", { password });
      navigate("/mypage/user/edit"); // 검증 성공 시 이동
    } catch (err) {
      setError("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h4 className="text-center mb-4">비밀번호 확인</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>현재 비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            확인
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default PasswordVerifyPage;
