import React, { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/config/apiConfig";

const PasswordVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 어떤 목적(수정 or 탈퇴)으로 왔는지 확인
  const actionType = location.state?.action || "edit";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 비밀번호 검증 요청
      await api.post("/api/mypage/check-password", { password });

      if (actionType === "edit") {
        navigate("/mypage/user/edit");
      } else if (actionType === "delete") {
        if (
          window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
        ) {
          await api.delete("/api/mypage/me", { data: { password } });

          // 토큰 삭제 및 탈퇴 안내 페이지로 이동
          localStorage.removeItem("accessToken");
          navigate("/mypage/delete-success");
        }
      }
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
