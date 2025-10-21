import { PencilFill } from 'react-bootstrap-icons';
import AdminFaqList from '../../../components/admin/AdminFaqList';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../../styles/admin/AdminFaq.css';

const AdminFaqPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="admin-faq-container">
            <Row className="align-items-center mb-4">
                <Col>
                    <h3 className="admin-faq-title">📄 FAQ 관리</h3>
                    <p className="admin-faq-subtitle">
                        자주 묻는 질문을 확인하고 수정할 수 있습니다.
                    </p>
                </Col>
                <Col xs="auto">
                    <Button
                        onClick={() => navigate("/admin/main/faqs/write")}
                        variant="dark"
                        className="admin-faq-write-btn"
                    >
                        <PencilFill size={16} className="me-2" />
                        새 FAQ 작성
                    </Button>
                </Col>
            </Row>

            <Card className="admin-faq-card shadow-sm">
                <Card.Body>
                    <AdminFaqList />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminFaqPage;
