import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AccountDeleteSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Card className="p-5 text-center shadow" style={{ maxWidth: "500px" }}>
        <h3 className="mb-4 text-success">회원 탈퇴가 완료되었습니다</h3>
        <p className="text-muted mb-4">
          그동안 서비스를 이용해주셔서 감사합니다.
          <br />
          언제든 다시 만나뵙길 바랍니다.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/login")}
          className="w-100"
        >
          로그인 페이지로 이동
        </Button>
      </Card>
    </Container>
  );
};

export default AccountDeleteSuccessPage;
