import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Container, Dropdown, Button } from 'react-bootstrap';
import api from '../../../config/apiConfig';
import meatballIcon from '../../../assets/image/meatball-icon.png';
import '../../../styles/admin/AdminFaq.css';

const AdminFaqDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [faq, setFaq] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchFaq = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/faqs/${id}`);
            console.log(response.data);
            setFaq(response.data.data); // backend 구조에 맞게 조정
        } catch (err) {
            console.error("FAQ 상세 조회 실패", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaq();
    }, [id]);

    const handleEdit = (faq) => {
        navigate(`/admin/main/faqs/edit/${faq.id}`);
    }

    const handleDelete = async () => {
        if (!window.confirm("정말 이 FAQ를 삭제하시겠습니까?")) return;

        try {
            await api.delete(`/api/faqs/${id}`);
            alert("삭제 완료");
            // 삭제 후 목록으로 이동
            window.history.back();
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제에 실패했습니다.");
        }
    };

    if (loading) return <p>FAQ 불러오는 중...</p>;
    if (!faq) return <p>FAQ 정보를 찾을 수 없습니다.</p>;

return (
        <div className="admin-faq-detail-wrapper">
            <Card className="admin-faq-detail-card shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <h3 className="admin-faq-detail-title">{faq.title}</h3>
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="light"
                            id="dropdown-basic"
                            size="sm"
                            className="border-0 bg-transparent"
                        >
                            <img
                                src={meatballIcon}
                                alt="메뉴"
                                style={{ width: 20, opacity: 0.7 }}
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleEdit(faq)}>수정</Dropdown.Item>
                            <Dropdown.Item onClick={handleDelete}>삭제</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="admin-faq-content-box">
                    <p className="admin-faq-content">{faq.content}</p>
                </div>

                <div className="admin-faq-info-box border-top mt-4 pt-3">
                    <p>
                        <strong>작성자:</strong> {faq.username}
                    </p>
                    <p>
                        <strong>작성일:</strong>{" "}
                        {new Date(faq.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </Card>

            <div className="text-center mt-4">
                <Button
                    variant="outline-secondary"
                    className="admin-faq-back-btn"
                    onClick={() => navigate("/admin/main/faqs")}
                >
                    목록으로 돌아가기
                </Button>
            </div>
        </div>
    );
};

export default AdminFaqDetailPage;
