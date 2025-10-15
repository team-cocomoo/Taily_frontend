import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Dropdown, Button } from 'react-bootstrap';
import api from '../../../config/apiConfig';
// import AdminFaqWriteModal from '../../../components/admin/AdminFaqWriteModal'; // 모달 컴포넌트
import meatballIcon from '../../../assets/image/meatball-icon.png';

const AdminFaqDetailPage = () => {
    const { id } = useParams();
    const [faq, setFaq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchFaq = async () => {
        setLoading(true);
        console.log(faq)
        try {
            const response = await api.get(`/api/faq/${id}`);
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

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 이 FAQ를 삭제하시겠습니까?")) return;

        try {
            await api.delete(`/api/faq/${id}`);
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
        <Card className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>
            <Dropdown className="float-end">
                <Dropdown.Toggle variant="light" id="dropdown-basic" size="sm">
                    <img src={meatballIcon} alt="메뉴" style={{ width: 20 }} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowModal(true)}>수정</Dropdown.Item>
                    <Dropdown.Item onClick={handleDelete}>삭제</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <h2>{faq.title}</h2>
            <Table borderless>
                <tbody>
                    <tr>
                        <td><strong>내용</strong></td>
                        <td>{faq.content}</td>
                    </tr>
                    <tr>
                        <td><strong>작성자</strong></td>
                        <td>{faq.username}</td>
                    </tr>
                    <tr>
                        <td><strong>작성일</strong></td>
                        <td>{new Date(faq.createdAt).toLocaleDateString()}</td>
                    </tr>
                </tbody>
            </Table>

            {/* FAQ 수정 모달 */}
            <AdminFaqWriteModal
                show={showModal}
                handleClose={handleModalClose}
                faq={faq} // 수정할 데이터
                onSuccess={(updatedFaq) => {
                    setFaq(updatedFaq); // 수정 후 상태 업데이트
                }}
            />
        </Card>
    );
};

export default AdminFaqDetailPage;
