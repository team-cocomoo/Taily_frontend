import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
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
            const response = await api.post("/api/admin/login", 
                formData,
                {
                    headers: { "Content-Type": "application/json" }
                } 
            );
            // JWT 가져오기
            const bearerToken = response.headers["authorization"];
            if (!bearerToken) throw new Error("토큰이 존재하지 않습니다.");

            const token = bearerToken.replace("Bearer ", "");
            localStorage.setItem("token", token);

            if (response.data.success) {
                navigate("/admin/user");
            }
        } catch (error) {
            console.error("로그인 실패:", error);
            setError(error.response?.data?.message || "로그인 실패: 아이디/비밀번호 확인");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Row className="w-100">
            <Col md={{ span: 4, offset: 4 }}>
            <Card>
                <Card.Body>
                <Card.Title className="text-center mb-4">Taily Admin Login</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>아이디</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="아이디 입력"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
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
    );
};

export default AdminLoginPage;