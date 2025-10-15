import React from "react";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Nav,
  InputGroup,
} from "react-bootstrap";
// 'LoginPage.css'에 공통 스타일이 있다면 그대로 사용하시면 좋습니다.
import axios from "axios";
import TailyLogo from "../../assets/image/tailylogo.svg";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    tel: "",
    email: "",
    address: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 여부 확인
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 필수 항목 체크
    if (
      !formData.id ||
      !formData.nickname ||
      !formData.password ||
      !formData.email
    ) {
      setErrorMessage("필수 입력 항목을 모두 작성해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 스프링부트 백엔드 API 호출
      const response = await axios.post(
        "http://localhost:8080/api/register",
        formData
      );
      if (response.data.success) {
        alert("회원가입이 완료되었습니다!");
        // 로그인 페이지로 리디렉션 또는 다른 처리
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    // 페이지 전체 레이아웃 (로그인 페이지와 동일한 구조)
    <Container fluid className="min-vh-100 d-flex flex-column">
      {/* 중앙 회원가입 영역 */}
      <Row className="flex-grow-1 justify-content-center align-items-center py-5">
        <Col xs={12} sm={10} md={8} lg={6}>
          <div className="text-center mb-4">
            {/* 중앙 로고 - SVG 이미지로 변경 */}
            <img
              src={TailyLogo}
              alt="Taily Logo"
              className="img-fluid" // Bootstrap의 반응형 이미지 클래스
              style={{ width: "250px", height: "auto" }} // 원하는 크기로 조정
            />
          </div>

          {/* 회원가입 폼 카드/영역 */}
          <div className="p-5 border bg-white shadow-sm">
            <Form onSubmit={handleSubmit}>
              {/* 1. ID (중복확인 버튼 포함) */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm="3" className="text-end">
                  ID
                </Form.Label>
                <Col sm="9">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="아이디"
                      className="rounded-0"
                    />
                    <Button
                      variant="outline-secondary"
                      className="rounded-0 border"
                    >
                      중복확인
                    </Button>
                  </InputGroup>
                </Col>
              </Form.Group>

              {/* 2. 닉네임 (중복확인 버튼 포함) */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm="3" className="text-end">
                  닉네임
                </Form.Label>
                <Col sm="9">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="닉네임"
                      className="rounded-0"
                    />
                    <Button
                      variant="outline-secondary"
                      className="rounded-0 border"
                    >
                      중복확인
                    </Button>
                  </InputGroup>
                </Col>
              </Form.Group>

              {/* 3. 비밀번호 */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm="3" className="text-end">
                  비밀번호
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="password"
                    placeholder="비밀번호"
                    className="rounded-0"
                  />
                </Col>
              </Form.Group>

              {/* 4. 비밀번호 확인 */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm="3" className="text-end">
                  비밀번호 확인
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="password"
                    placeholder="비밀번호 확인"
                    className="rounded-0"
                  />
                </Col>
              </Form.Group>

              {/* 5. TEL */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm="3" className="text-end">
                  TEL
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="tel"
                    placeholder="연락처"
                    className="rounded-0"
                  />
                </Col>
              </Form.Group>

              {/* 6. Email (중복확인 버튼 포함) */}
              <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm="3" className="text-end">
                  Email
                </Form.Label>
                <Col sm="9">
                  <InputGroup>
                    <Form.Control
                      type="email"
                      placeholder="이메일 주소"
                      className="rounded-0"
                    />
                    <Button
                      variant="outline-secondary"
                      className="rounded-0 border"
                    >
                      중복확인
                    </Button>
                  </InputGroup>
                </Col>
              </Form.Group>

              {/* 7. 주소 */}
              <Form.Group as={Row} className="mb-4 align-items-center">
                <Form.Label column sm="3" className="text-end">
                  주소
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    placeholder="주소"
                    className="rounded-0"
                  />
                </Col>
              </Form.Group>

              {/* 완료 버튼 */}
              <div className="d-grid gap-2 mt-4">
                <Button
                  variant="warning"
                  type="submit"
                  className="py-2 fw-bold rounded-0"
                  style={{ fontSize: "1.2rem" }}
                >
                  완료
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
