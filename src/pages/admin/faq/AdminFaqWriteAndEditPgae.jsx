import React, { useEffect, useState } from 'react';
import FaqWriteForm from '../../../components/admin/FaqWriteForm';
import { Container } from 'react-bootstrap';
import api from '../../../config/apiConfig';
import { useNavigate, useParams } from 'react-router-dom';

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
        <Container style={{ marginTop: "120px" }}>
            <div className="mt-5 p-4">
                <h4 style={{fontWeight:"bold"}}>FAQ</h4>
            </div>
            <FaqWriteForm
                initialData={faqDetail}
                isEditMode={!!id}
                onSuccess={(savedFaq) => navigate(`/admin/main/faqs/${savedFaq.id}`)}
            />
        </Container>
    );
};

export default AdminFaqWriteAndEditPgae;