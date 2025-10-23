import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "@/config/apiConfig";

import MyPageSidebar from "@/components/mypage/MyPageSidebar";
import SecureImage from "@/components/common/SecureImage";

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

  // 탈퇴 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // 사용자 정보 불러오기
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

        const imgRes = await api.get("/api/images", {
          params: { tableTypesId: 1 },
        });

        if (imgRes.data && imgRes.data.length > 0) {
          setPreview(imgRes.data[0].filePath);
        } else {
          setPreview(null);
        }
      } catch (err) {
        console.error("회원 정보 불러오기 실패:", err);
        setError("회원 정보를 불러오지 못했습니다.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // 회원 정보 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.put("/api/mypage/me", user);

      if (profileImage) {
        const formData = new FormData();
        formData.append("tableTypesId", 1);
        formData.append("files", profileImage);

        await api.post("/api/images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess("회원 정보가 성공적으로 수정되었습니다.");
      setTimeout(() => navigate("/mypage/user"), 1500);
    } catch {
      setError("정보 수정에 실패했습니다.");
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!password) {
      setDeleteError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      await api.delete("/api/mypage/me", {
        data: { password },
      });
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 401) {
        setDeleteError("비밀번호가 일치하지 않습니다.");
      } else {
        setDeleteError("회원 탈퇴에 실패했습니다.");
      }
    }
  };

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={3} className="border-end">
          <MyPageSidebar />
        </Col>

        <Col md={9}>
          <Card className="p-4 shadow-sm mt-3" style={{ maxWidth: "600px" }}>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* 프로필 이미지 */}
              <Form.Group className="mb-3 text-center d-flex flex-column align-items-center text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="프로필 미리보기"
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light mb-3 d-flex justify-content-center align-items-center"
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
                variant="danger"
                className="w-100 mt-3"
                onClick={() => setShowDeleteModal(true)}
              >
                회원 탈퇴
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* 비밀번호 확인 모달 */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>회원 탈퇴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>회원 탈퇴를 위해 비밀번호를 입력해주세요.</p>
          <Form.Control
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {deleteError && (
            <Alert variant="danger" className="mt-3">
              {deleteError}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            탈퇴하기
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyPageEdit;
