import React, { useEffect, useState } from "react";
import { Accordion, Pagination } from "react-bootstrap";
import api from "../../config/apiConfig";

const FaqList = () => {
    const [faqList, setFaqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const itemsPerPage = 5;

    const fetchFaqs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get("/api/faqs", {
                params: { page, size: itemsPerPage } // 백엔드 페이지 요청
            });
            const data = response.data?.data;
            setFaqList(data?.faqList || []);
            setTotalCount(data?.totalCount || 0);
        } catch (error) {
            console.error("faq 리스트 조회 실패: ", error);
            setFaqList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs(currentPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    if (loading) return <p>FAQ 리스트 불러오는 중...</p>;
    if (!faqList.length) return <p>등록된 FAQ가 없습니다.</p>;

    return (
        <>
            <Accordion defaultActiveKey="0">
                {faqList.map((faq, index) => (
                    <Accordion.Item eventKey={index.toString()} key={faq.id}>
                        <Accordion.Header>{`Q${(currentPage - 1) * itemsPerPage + index + 1}. ${faq.title}`}</Accordion.Header>
                        <Accordion.Body>{`A${(currentPage - 1) * itemsPerPage + index + 1}. ${faq.content}`}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>

            <Pagination className="mt-5 mb-5 justify-content-center custom-pagination">
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
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
                />
            </Pagination>
        </>
    );
};

export default FaqList;
