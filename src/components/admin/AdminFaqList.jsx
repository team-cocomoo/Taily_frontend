import React, { useEffect, useState } from 'react';
import api from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import { Pagination, Table } from 'react-bootstrap';

const AdminFaqList = () => {
    const navigate = useNavigate();

    const [faqList, setFaqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const fetchFaqs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get("/api/faq", {
                params: { page, size: itemsPerPage } // param → params로 수정
            });
            const data = response.data?.data;

            console.log("data : ", data); // data.faqList, data.totalCount 확인 가능
            
            setFaqList(Array.isArray(data?.faqList) ? data.faqList : []);
            setTotalCount(data?.totalCount || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error("faq 리스트 조회 실패", error);
            setFaqList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };


    // 최초 렌더링
    useEffect(() => {
        fetchFaqs(currentPage);
    }, [currentPage]);

    const handleFaqClick = (id) => {
        navigate(`/admin/faqs/${id}`); // 상세 페이지로 이동
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber); // 상태 변경 → useEffect에서 fetch
    };

    if (loading) return <p>FAQ 리스트 불러오는 중...</p>;
    if (!faqList.length) return <p className="text-center">등록된 FAQ가 없습니다.</p>;

    return (
        <>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>제목</th>
                        <th>작성일</th>
                        <th>작성자</th>
                    </tr>
                </thead>
                <tbody>
                    {faqList.map((faq, index) => (
                        <tr key={faq.id || index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleFaqClick(faq.id)}
                            >
                                {faq.title}
                            </td>
                            <td>{new Date(faq.createdAt).toLocaleDateString()}</td>
                            <td>{faq.username}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Pagination.Prev>

                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Pagination.Next>
                </Pagination>
            )}
        </>
    );
};

export default AdminFaqList;
