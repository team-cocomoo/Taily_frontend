import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import api from '../../config/apiConfig';

const FaqWriteForm = ({ initialData, isEditMode, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        content: "",
    });
    
    // 수정 모드일 경우 기존 데이터 채우기
    useEffect(() => {
        console.log("초기 데이터:", initialData);

        if (initialData) {
            setForm({
                title: initialData.title || "",
                content: initialData.content || ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        try {
            let response;
            if (isEditMode && initialData?.id) {
                // 수정
                response = await api.put(`/api/faqs/${initialData.id}`, form, {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
                });
            } else {
                // 작성
                response = await api.post(`/api/faqs`, form, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                });
            }

            if (response.status === 200 || response.status === 201) {
                alert(`FAQ가 ${isEditMode ? "수정" : "등록"}되었습니다!`);
                onSuccess?.(response.data.data);
                // navigate("/admin/faqs");
            } else {
                setError("FAQ 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("작성/수정 중 오류:", error);
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded-3">
                <Form.Group  className="mb-3" controlId="title">
                    <Form.Label>제목</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="title"
                        value={form.title} 
                        onChange={handleChange} 
                        placeholder='FAQ 제목을 입력하세요'
                        required 
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="content">
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="FAQ 내용을 입력하세요"
                        required
                    />
                </Form.Group>

                {error && <p className="text-danger text-center mt-2">{error}</p>}

                <Button variant="success" type="submit" disabled={loading}>
                    {loading ? "처리 중..." : isEditMode ? "수정완료" : "작성완료"}
                </Button>
            </Form>
            
        </>
    );
};

export default FaqWriteForm;