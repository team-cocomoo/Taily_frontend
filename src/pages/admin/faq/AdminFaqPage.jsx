import React from 'react';

const AdminFaqPage = () => {
    return (
        <Container style={{ marginTop: "120px" }}>
            <h1 className='faq-title mb-3'>자주 묻는 질문</h1>
            <FaqList />
            <Inquiries />
        </Container>
    );
};

export default AdminFaqPage;