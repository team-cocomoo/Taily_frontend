import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";

const MyPageEdit = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    nickname: "",
    tel: "",
    email: "",
    address: "",
    introduction: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 현재 로그인한 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/api/mypage/me");
        setUser({
          nickname: res.data.nickname,
          tel: res.data.tel,
          email: res.data.email,
          address: res.data.address,
          introduction: res.data.introduction,
        });
        if (res.data.profileImageUrl) {
          setPreview(res.data.profileImageUrl);
        }
      } catch (err) {
        setError("회원 정보를 불러오지 못했습니다.");
      }
    };
    fetchUserInfo();
  }, []);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 이미지 선택 시 미리보기 설정
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // 수정 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify(user)], { type: "application/json" })
      );
      if (profileImage) formData.append("profileImage", profileImage);

      await api.patch("/api/mypage/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("회원 정보가 성공적으로 수정되었습니다.");
      setTimeout(() => navigate("/mypage"), 1500); // 1.5초 후 마이페이지로 이동
    } catch (err) {
      setError("정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card className="p-4 shadow" style={{ width: "500px" }}>
        <h4 className="text-center mb-4">내 정보 수정</h4>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* 프로필 이미지 */}
          <Form.Group className="mb-3 text-center">
            {preview ? (
              <img
                src={preview}
                alt="프로필 미리보기"
                className="rounded-circle mb-3"
                width={120}
                height={120}
              />
            ) : (
              <div
                className="rounded-circle bg-light mb-3"
                style={{
                  width: "120px",
                  height: "120px",
                  lineHeight: "120px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                사진 없음
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          {/* 닉네임 */}
          <Form.Group className="mb-3">
            <Form.Label>닉네임</Form.Label>
            <Form.Control
              type="text"
              name="nickname"
              value={user.nickname}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 전화번호 */}
          <Form.Group className="mb-3">
            <Form.Label>전화번호</Form.Label>
            <Form.Control
              type="text"
              name="tel"
              value={user.tel}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 이메일 */}
          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 주소 */}
          <Form.Group className="mb-3">
            <Form.Label>주소</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 소개글 */}
          <Form.Group className="mb-3">
            <Form.Label>소개글</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="introduction"
              value={user.introduction}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            저장하기
          </Button>
          <Button
            variant="secondary"
            className="w-100 mt-2"
            onClick={() => navigate("/mypage")}
          >
            취소
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default MyPageEdit;
