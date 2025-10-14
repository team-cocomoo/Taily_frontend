import React from 'react';
import { Container } from 'react-bootstrap';
import FaqList from '../../components/cs/FaqList';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/cs/faqs.css"
import Inquiries from '../../components/cs/Inquiries';

const FaqPage = () => {
    return (
        <Container style={{ marginTop: "120px" }}>
            <h1 className='faq-title mb-3'>자주 묻는 질문</h1>
            <FaqList />
            <Inquiries />
        </Container>
    );
};

export default FaqPage;