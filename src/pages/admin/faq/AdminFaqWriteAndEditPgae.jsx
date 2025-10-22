import React, { useEffect, useState } from 'react';
import FaqWriteForm from '../../../components/admin/FaqWriteForm';
import { Card } from 'react-bootstrap';
import api from '../../../config/apiConfig';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/admin/AdminFaq.css';

const AdminFaqWriteAndEditPgae = () => {
    const { id } = useParams(); // url에 id가 있으면 수정 모드
    const [faqDetail, setFaqDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isEditMode = !!id;

    // 수정 모드일 때만 기존 데이터 불러오기
    useEffect(() => {
        if (!id) {
            return; // id 없으면 작성 모드
        }
        
        const fetchFaq = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/faqs/${id}`);
                if (response.data.success) {
                    setFaqDetail(response.data.data);
                }
            } catch (error) {
                console.error("FAQ 불러오기 실패", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaq();
    }, [id, isEditMode]);
    
    if (loading) return <p>"faq 기존 데이터 불러오는 중..."</p>;

    return (
        <div className="admin-faq-detail-wrapper">
            <Card className="admin-faq-detail-card shadow-sm">
                <div className="mb-4">
                    <h3 className="admin-faq-detail-title">
                        {isEditMode ? "FAQ 수정" : "FAQ 작성"}
                    </h3>
                    <p className="text-muted mb-0">
                        {isEditMode
                            ? "기존 FAQ 내용을 수정하세요."
                            : "새로운 FAQ를 등록하세요."}
                    </p>
                </div>

                <FaqWriteForm
                    initialData={faqDetail}
                    isEditMode={isEditMode}
                    onSuccess={(savedFaq) => navigate(`/admin/main/faqs/${savedFaq.id}`)}
                />
            </Card>
        </div>
    );
};

export default AdminFaqWriteAndEditPgae;