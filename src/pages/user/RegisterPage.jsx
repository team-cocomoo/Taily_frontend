import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TailyLogo from "../../assets/image/tailylogo.svg";
import "../../styles/user/RegisterPage.css";
import UserService from "@/api/UserService"; // api 관련 메서드 모음

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
    tel: "",
    email: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkMsg, setCheckMsg] = useState({
    username: "",
    nickname: "",
    email: "",
  });

  // 비밀번호 일치 상태 표시용
  const [passwordMatch, setPasswordMatch] = useState(null);

  /** 입력 변경 처리 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  /** 비밀번호 실시간 비교 */
  useEffect(() => {
    if (!formData.password && !formData.passwordConfirm) {
      setPasswordMatch(null);
    } else if (formData.password === formData.passwordConfirm) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }, [formData.password, formData.passwordConfirm]);

  /** 중복확인 함수 */
  const handleCheckDuplicate = async (type) => {
    try {
      const value = formData[type];
      if (!value) {
        setCheckMsg((prev) => ({
          ...prev,
          [type]: `${type}을(를) 입력해주세요.`,
        }));
        return;
      }

      let isDuplicate = false;

      if (type === "username")
        isDuplicate = await UserService.checkUsername(value);
      if (type === "nickname")
        isDuplicate = await UserService.checkNickname(value);
      if (type === "email") isDuplicate = await UserService.checkEmail(value);

      if (isDuplicate) {
        setCheckMsg((prev) => ({
          ...prev,
          [type]: `이미 사용 중인 ${type}입니다.`,
        }));
      } else {
        setCheckMsg((prev) => ({
          ...prev,
          [type]: `사용 가능한 ${type}입니다.`,
        }));
      }
    } catch (err) {
      setCheckMsg((prev) => ({
        ...prev,
        [type]: `${type} 중복확인 중 오류가 발생했습니다.`,
      }));
    }
  };

  /** 회원가입 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 검사
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const data = await UserService.register(formData);

      if (data?.success) {
        setSuccess("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("회원가입 실패: 서버 응답이 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("회원가입 실패:", err);
      const message =
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setError(message);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex flex-column">
      <Row className="flex-grow-1 justify-content-center align-items-center py-5">
        <Col xs={12} sm={10} md={8} lg={6}>
          {/* 로고 */}
          <div className="text-center mb-4 d-block mx-auto tailylogo">
            <img
              src={TailyLogo}
              alt="Taily Logo"
              className="img-fluid logo-img"
            />
          </div>

          {/* 카드 */}
          <Card className="form-card registerform">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* ID */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label
                    column
                    xs={12}
                    md={3}
                    className="text-start mb-2 mb-md-0 inputname"
                  >
                    ID
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="아이디"
                        className="form-input-bordered"
                      />
                      <Button
                        type="button"
                        className="check-button-bordered"
                        onClick={() => handleCheckDuplicate("username")}
                      >
                        중복확인
                      </Button>
                    </div>
                    {checkMsg.username && (
                      <small className="text-muted ms-1">
                        {checkMsg.username}
                      </small>
                    )}
                  </Col>
                </Form.Group>

                {/* 닉네임 */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label
                    column
                    xs={12}
                    md={3}
                    className="text-start mb-2 mb-md-0 inputname"
                  >
                    닉네임
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <Form.Control
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="닉네임"
                        className="form-input-bordered"
                      />
                      <Button
                        type="button"
                        className="check-button-bordered"
                        onClick={() => handleCheckDuplicate("nickname")}
                      >
                        중복확인
                      </Button>
                    </div>
                    {checkMsg.nickname && (
                      <small className="text-muted ms-1">
                        {checkMsg.nickname}
                      </small>
                    )}
                  </Col>
                </Form.Group>

                {/* 비밀번호 */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label
                    column
                    xs={12}
                    md={3}
                    className="text-start mb-2 mb-md-0 inputname"
                  >
                    비밀번호
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="비밀번호"
                      className="form-input-bordered"
                    />
                  </Col>
                </Form.Group>

                {/* 비밀번호 확인 */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label
                    column
                    xs={12}
                    md={3}
                    className="text-start mb-2 mb-md-0 inputname"
                  >
                    비밀번호 확인
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      placeholder="비밀번호 확인"
                      className="form-input-bordered"
                    />
                    {/* 비밀번호 일치/불일치 실시간 표시 */}
                    {passwordMatch === true && (
                      <small className="text-success ms-1">
                        비밀번호가 일치합니다.
                      </small>
                    )}
                    {passwordMatch === false && (
                      <small className="text-danger ms-1">
                        비밀번호가 일치하지 않습니다.
                      </small>
                    )}
                  </Col>
                </Form.Group>

                {/* TEL */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label
                    column
                    xs={12}
                    md={3}
                    className="text-start mb-2 mb-md-0 inputname"
                  >
                    TEL
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      type="tel"
                      name="tel"
                      value={formData.tel}
                      onChange={handleChange}
                      placeholder="연락처"
                      className="form-input-bordered"
                    />
                  </Col>
                </Form.Group>

                {/* Email */}
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label
                    column
                    xs={12}
                    md={3}
                    className="text-start mb-2 mb-md-0 inputname"
                  >
                    Email
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="이메일 주소"
                        className="form-input-bordered"
                      />
                      <Button
                        type="button"
                        className="check-button-bordered"
                        onClick={() => handleCheckDuplicate("email")}
                      >
                        중복확인
                      </Button>
                    </div>
                    {checkMsg.email && (
                      <small className="text-muted ms-1">
                        {checkMsg.email}
                      </small>
                    )}
                  </Col>
                </Form.Group>

                {/* 주소 */}
                <Form.Group as={Row} className="mb-4 align-items-center">
                  <Form.Label
                    column
                    xs={12}
                    md={3}
                    className="text-start mb-2 mb-md-0 inputname"
                  >
                    주소
                  </Form.Label>
                  <Col xs={12} md={9}>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="주소"
                      className="form-input-bordered"
                    />
                  </Col>
                </Form.Group>

                {/* 오류 / 성공 알림 */}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {/* 완료 버튼 */}
                <Row>
                  <Col xs={12} className="d-grid mt-4">
                    <Button type="submit" className="submit-button-bordered">
                      완료
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
